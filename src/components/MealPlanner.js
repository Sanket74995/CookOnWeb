import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/MealPlanner.scss';
import Loader from './Loader';

const RECIPES_API = 'http://localhost:5000/api/recipes';
const PLANNER_API = 'http://localhost:5000/api/meal-plans';
const AUTH_API = 'http://localhost:5000/api/auth';
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const pad = (value) => String(value).padStart(2, '0');

const getMonday = (date = new Date()) => {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parseLocalDate = (value) => {
  const [year, month, day] = String(value || '').split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};
const prettyDate = (value) => parseLocalDate(value).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const getWeekDays = (weekStart) => {
  const start = parseLocalDate(weekStart);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return formatDate(date);
  });
};

const emptyCell = { recipe: '', servings: 1, notes: '' };

const MealPlanner = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const [recipes, setRecipes] = useState([]);
  const [weekStart, setWeekStart] = useState(formatDate(getMonday()));
  const [planEntries, setPlanEntries] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [nutrition, setNutrition] = useState(null);
  const [familyGroups, setFamilyGroups] = useState([]);
  const [familyGroupId, setFamilyGroupId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await fetch(RECIPES_API);
        const data = await response.json();
        if (response.ok) {
          setRecipes(data);
        }
      } catch (error) {
        console.error('Failed to load recipes for planner:', error);
      }
    };

    loadRecipes();
  }, []);

  useEffect(() => {
    if (!token) return;

    const loadFamilyGroups = async () => {
      try {
        const response = await fetch(`${AUTH_API}/family-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setFamilyGroups(data);
        }
      } catch (error) {
        console.error('Failed to load family groups:', error);
      }
    };

    loadFamilyGroups();
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadPlan = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ weekStart });
        if (familyGroupId) params.set('familyGroupId', familyGroupId);
        const response = await fetch(`${PLANNER_API}/current?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load meal plan');
        }
        setPlanEntries(data.entries || []);
      } catch (error) {
        console.error('Failed to load meal plan:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [token, weekStart, familyGroupId]);

  useEffect(() => {
    if (!token) return;

    const loadShoppingList = async () => {
      try {
        const response = await fetch(`${PLANNER_API}/shopping-list?weekStart=${weekStart}${familyGroupId ? `&familyGroupId=${familyGroupId}` : ''}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ weekStart, familyGroupId: familyGroupId || null })
        });
        const data = await response.json();
        if (response.ok) {
          setShoppingList(data.items || []);
        }
      } catch (error) {
        console.error('Failed to load shopping list:', error);
      }
    };

    loadShoppingList();
  }, [planEntries, token, weekStart, familyGroupId]);

  useEffect(() => {
    if (!token) return;

    const loadNutrition = async () => {
      try {
        const params = new URLSearchParams({ weekStart });
        if (familyGroupId) params.set('familyGroupId', familyGroupId);
        const response = await fetch(`${PLANNER_API}/nutrition?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setNutrition(data);
        }
      } catch (error) {
        console.error('Failed to load nutrition dashboard:', error);
      }
    };

    loadNutrition();
  }, [token, weekStart, familyGroupId, planEntries]);

  const getCellEntry = (date, mealType) =>
    planEntries.find((entry) => entry.date === date && entry.mealType === mealType) || emptyCell;

  const updateCell = (date, mealType, field, value) => {
    setPlanEntries((prev) => {
      const next = [...prev];
      const index = next.findIndex((entry) => entry.date === date && entry.mealType === mealType);

      if (index === -1) {
        next.push({
          date,
          mealType,
          ...emptyCell,
          [field]: value
        });
        return next;
      }

      next[index] = {
        ...next[index],
        [field]: value
      };
      return next;
    });
  };

  const savePlan = async () => {
    if (!token) {
      alert(t('please_log_in_to_save_meal_plan'));
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${PLANNER_API}/current`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          weekStart,
          familyGroupId: familyGroupId || null,
          entries: planEntries.filter((entry) => entry.recipe)
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save meal plan');
      }
      setPlanEntries(data.entries || []);
      alert(t('meal_plan_saved'));
    } catch (error) {
      console.error('Failed to save meal plan:', error);
      alert(error.message || t('unable_save_meal_plan'));
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="planner-page">
        <div className="planner-card planner-card--empty">
          <h2>{t('meal_planner')}</h2>
          <p>{t('please_log_in_to_build_meal_plan')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <section className="planner-hero">
        <div className="planner-hero__content">
          <span className="planner-kicker">{t('meal_planner')}</span>
          <h1>{t('meal_planner')}</h1>
          <p>{t('meal_planner_subtitle')}</p>
        </div>
        <div className="planner-hero__actions">
          <div className="planner-control">
            <span>{t('planner_scope')}</span>
            <select value={familyGroupId} onChange={(e) => setFamilyGroupId(e.target.value)}>
              <option value="">{t('my_personal_planner')}</option>
              {familyGroups.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className="planner-control">
            <span>{t('week_start')}</span>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
            />
          </div>
          <button type="button" className="btn-primary planner-save" onClick={savePlan} disabled={saving}>
            {saving ? t('saving') : t('save_week')}
          </button>
        </div>
      </section>

      {loading ? (
        <Loader label={t('loading_meal_plan')} variant="section" />
      ) : (
        <section className="planner-board">
          {weekDays.map((date) => (
            <article key={date} className="planner-day">
              <div className="planner-day__header">
                <h3>{prettyDate(date)}</h3>
                <span>{MEAL_TYPES.length} {t('meals')}</span>
              </div>

              <div className="planner-day__meals">
                {MEAL_TYPES.map((mealType) => {
                  const entry = getCellEntry(date, mealType);
                  return (
                    <div key={`${date}-${mealType}`} className="planner-slot">
                      <div className="planner-slot__header">
                        <label>{t(mealType)}</label>
                        <span>{t('plan_meal')}</span>
                      </div>

                      <select
                        value={entry.recipe?._id || entry.recipe || ''}
                        onChange={(e) => updateCell(date, mealType, 'recipe', e.target.value)}
                      >
                        <option value="">{t('choose_recipe')}</option>
                        {recipes.map((recipe) => (
                          <option key={recipe._id} value={recipe._id}>
                            {recipe.title}
                          </option>
                        ))}
                      </select>

                      <div className="planner-slot__meta">
                        <input
                          type="number"
                          min="1"
                          value={entry.servings || 1}
                          onChange={(e) => updateCell(date, mealType, 'servings', Number(e.target.value) || 1)}
                          placeholder={t('servings')}
                        />
                        <input
                          type="text"
                          value={entry.notes || ''}
                          onChange={(e) => updateCell(date, mealType, 'notes', e.target.value)}
                          placeholder={t('optional_note')}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="planner-summary">
        <div className="planner-card">
          <div className="planner-card__header">
            <div>
              <h2>{t('nutrition_dashboard')}</h2>
              <p>{nutrition ? t('live_from_this_plan') : t('no_data_yet')}</p>
            </div>
          </div>
          {nutrition ? (
            <div className="planner-stats">
              <div className="planner-stat">
                <span>Calories</span>
                <strong>{Math.round(nutrition.totals.calories || 0)}</strong>
              </div>
              <div className="planner-stat">
                <span>Protein</span>
                <strong>{Math.round(nutrition.totals.protein || 0)} g</strong>
              </div>
              <div className="planner-stat">
                <span>Carbs</span>
                <strong>{Math.round(nutrition.totals.carbs || 0)} g</strong>
              </div>
              <div className="planner-stat">
                <span>Fat</span>
                <strong>{Math.round(nutrition.totals.fat || 0)} g</strong>
              </div>
            </div>
          ) : (
            <p>Add recipes to the planner to see nutrition totals.</p>
          )}
        </div>

        <div className="planner-card">
          <div className="planner-card__header">
            <div>
              <h2>{t('shopping_list')}</h2>
              <p>{shoppingList.length} {t('items')}</p>
            </div>
          </div>
          {shoppingList.length === 0 ? (
            <p>{t('add_recipes_to_generate_shopping_list')}</p>
          ) : (
            <div className="shopping-list">
              {shoppingList.map((item) => (
                <div key={`${item.name}-${item.unit}`} className="shopping-item">
                  <div>
                    <strong>{item.name}</strong>
                    <div className="shopping-item__meta">
                      {item.sources.slice(0, 2).map((source) => source.recipeTitle).join(', ')}
                    </div>
                  </div>
                  <span>{item.quantity} {item.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MealPlanner;
