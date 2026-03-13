import React, { useEffect, useMemo, useState } from 'react';
import '../styles/MealPlanner.scss';

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
      alert('Please log in to save your meal plan.');
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
      alert('Meal plan saved.');
    } catch (error) {
      console.error('Failed to save meal plan:', error);
      alert(error.message || 'Unable to save meal plan');
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="planner-page">
        <div className="planner-card">
          <h2>Meal Planner</h2>
          <p>Please log in to build your weekly meal plan and shopping list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <div className="planner-header">
        <div>
          <h1>Meal Planner</h1>
          <p>Plan your week, assign recipes by meal, and auto-build your shopping list.</p>
        </div>
        <div className="planner-header__actions">
          <select value={familyGroupId} onChange={(e) => setFamilyGroupId(e.target.value)}>
            <option value="">My personal planner</option>
            {familyGroups.map((group) => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
          <button type="button" className="btn-primary" onClick={savePlan} disabled={saving}>
            {saving ? 'Saving...' : 'Save Week'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="planner-card">Loading your meal plan...</div>
      ) : (
        <div className="planner-grid">
          {weekDays.map((date) => (
            <section key={date} className="planner-day">
              <h3>{prettyDate(date)}</h3>
              {MEAL_TYPES.map((mealType) => {
                const entry = getCellEntry(date, mealType);
                return (
                  <div key={`${date}-${mealType}`} className="planner-slot">
                    <label>{mealType}</label>
                    <select
                      value={entry.recipe?._id || entry.recipe || ''}
                      onChange={(e) => updateCell(date, mealType, 'recipe', e.target.value)}
                    >
                      <option value="">Choose recipe</option>
                      {recipes.map((recipe) => (
                        <option key={recipe._id} value={recipe._id}>
                          {recipe.title}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={entry.servings || 1}
                      onChange={(e) => updateCell(date, mealType, 'servings', Number(e.target.value) || 1)}
                      placeholder="Servings"
                    />
                    <input
                      type="text"
                      value={entry.notes || ''}
                      onChange={(e) => updateCell(date, mealType, 'notes', e.target.value)}
                      placeholder="Optional note"
                    />
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      )}

      <div className="planner-card">
        <div className="planner-card__header">
          <h2>Nutrition Dashboard</h2>
          <span>{nutrition ? 'Live from this plan' : 'No data yet'}</span>
        </div>
        {nutrition ? (
          <div className="shopping-list">
            <div className="shopping-item"><strong>Calories</strong><span>{Math.round(nutrition.totals.calories || 0)}</span></div>
            <div className="shopping-item"><strong>Protein</strong><span>{Math.round(nutrition.totals.protein || 0)} g</span></div>
            <div className="shopping-item"><strong>Carbs</strong><span>{Math.round(nutrition.totals.carbs || 0)} g</span></div>
            <div className="shopping-item"><strong>Fat</strong><span>{Math.round(nutrition.totals.fat || 0)} g</span></div>
          </div>
        ) : (
          <p>Add recipes to the planner to see nutrition totals.</p>
        )}
      </div>

      <div className="planner-card">
        <div className="planner-card__header">
          <h2>Shopping List</h2>
          <span>{shoppingList.length} items</span>
        </div>
        {shoppingList.length === 0 ? (
          <p>Add recipes to your week to generate a shopping list.</p>
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
    </div>
  );
};

export default MealPlanner;
