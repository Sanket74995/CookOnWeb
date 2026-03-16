import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/NutritionAnalytics.scss';

const NutritionAnalytics = () => {
  const { t } = useTranslation();
  const [nutritionData, setNutritionData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25
  });

  useEffect(() => {
    loadNutritionData();
  }, [selectedPeriod]);

  const loadNutritionData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/nutrition/analytics?period=${selectedPeriod}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNutritionData(data);
      } else {
        // Mock data for demonstration
        setNutritionData(getMockNutritionData());
      }
    } catch (error) {
      console.error('Error loading nutrition data:', error);
      setNutritionData(getMockNutritionData());
    } finally {
      setLoading(false);
    }
  };

  const getMockNutritionData = () => {
    return {
      summary: {
        totalCalories: 1850,
        totalProtein: 125,
        totalCarbs: 220,
        totalFat: 65,
        totalFiber: 22,
        averageRating: 4.2
      },
      dailyBreakdown: [
        { date: '2024-01-15', calories: 1950, protein: 130, carbs: 235, fat: 68 },
        { date: '2024-01-16', calories: 1820, protein: 120, carbs: 210, fat: 62 },
        { date: '2024-01-17', calories: 1880, protein: 128, carbs: 225, fat: 66 },
        { date: '2024-01-18', calories: 1920, protein: 135, carbs: 240, fat: 70 },
        { date: '2024-01-19', calories: 1780, protein: 118, carbs: 205, fat: 58 },
        { date: '2024-01-20', calories: 1900, protein: 132, carbs: 230, fat: 67 },
        { date: '2024-01-21', calories: 1850, protein: 125, carbs: 220, fat: 65 }
      ],
      topIngredients: [
        { name: 'Chicken Breast', amount: 450, unit: 'g', nutrition: { protein: 120, calories: 660 } },
        { name: 'Brown Rice', amount: 300, unit: 'g', nutrition: { carbs: 180, calories: 1095 } },
        { name: 'Broccoli', amount: 200, unit: 'g', nutrition: { fiber: 10, calories: 140 } },
        { name: 'Olive Oil', amount: 50, unit: 'ml', nutrition: { fat: 45, calories: 420 } },
        { name: 'Greek Yogurt', amount: 150, unit: 'g', nutrition: { protein: 15, calories: 90 } }
      ],
      mealDistribution: {
        breakfast: 25,
        lunch: 35,
        dinner: 30,
        snacks: 10
      },
      deficiencies: [
        { nutrient: 'Vitamin D', current: 15, recommended: 20, status: 'low' },
        { nutrient: 'Calcium', current: 800, recommended: 1000, status: 'moderate' },
        { nutrient: 'Iron', current: 12, recommended: 18, status: 'moderate' }
      ]
    };
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage < 70) return '#e74c3c';
    if (percentage < 90) return '#f39c12';
    if (percentage <= 110) return '#27ae60';
    return '#e74c3c';
  };

  const getStatusText = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage < 70) return 'Low';
    if (percentage < 90) return 'Good';
    if (percentage <= 110) return 'Excellent';
    return 'High';
  };

  const updateGoals = async (newGoals) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/nutrition/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newGoals)
      });
      setGoals(newGoals);
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  if (loading) {
    return (
      <div className="nutrition-loading">
        <div className="loading-spinner"></div>
        <p>{t('analyzing_nutrition_data')}</p>
      </div>
    );
  }

  return (
    <div className="nutrition-analytics">
      <div className="analytics-header">
        <h1>{t('nutrition_analytics')}</h1>
        <p>{t('nutrition_analytics_subtitle')}</p>
      </div>

      <div className="period-selector">
        <button
          className={selectedPeriod === 'week' ? 'active' : ''}
          onClick={() => setSelectedPeriod('week')}
        >
          {t('this_week')}
        </button>
        <button
          className={selectedPeriod === 'month' ? 'active' : ''}
          onClick={() => setSelectedPeriod('month')}
        >
          {t('this_month')}
        </button>
        <button
          className={selectedPeriod === '3months' ? 'active' : ''}
          onClick={() => setSelectedPeriod('3months')}
        >
          {t('three_months')}
        </button>
      </div>

      <div className="nutrition-overview">
        <div className="overview-cards">
          <div className="metric-card">
            <div className="metric-header">
              <h3>{t('calories')}</h3>
              <span className="metric-value">{nutritionData.summary.totalCalories}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((nutritionData.summary.totalCalories / goals.calories) * 100, 100)}%`,
                  backgroundColor: getProgressColor(nutritionData.summary.totalCalories, goals.calories)
                }}
              />
            </div>
            <div className="metric-target">
              {t('target_calories', { calories: goals.calories })}
              <span className={`status ${getStatusText(nutritionData.summary.totalCalories, goals.calories).toLowerCase()}`}>
                {t(getStatusText(nutritionData.summary.totalCalories, goals.calories).toLowerCase())}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>{t('protein')}</h3>
              <span className="metric-value">{nutritionData.summary.totalProtein}g</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((nutritionData.summary.totalProtein / goals.protein) * 100, 100)}%`,
                  backgroundColor: getProgressColor(nutritionData.summary.totalProtein, goals.protein)
                }}
              />
            </div>
            <div className="metric-target">
              Target: {goals.protein}g
              <span className={`status ${getStatusText(nutritionData.summary.totalProtein, goals.protein).toLowerCase()}`}>
                {t(getStatusText(nutritionData.summary.totalProtein, goals.protein).toLowerCase())}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>{t('carbohydrates')}</h3>
              <span className="metric-value">{nutritionData.summary.totalCarbs}g</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((nutritionData.summary.totalCarbs / goals.carbs) * 100, 100)}%`,
                  backgroundColor: getProgressColor(nutritionData.summary.totalCarbs, goals.carbs)
                }}
              />
            </div>
            <div className="metric-target">
              Target: {goals.carbs}g
              <span className={`status ${getStatusText(nutritionData.summary.totalCarbs, goals.carbs).toLowerCase()}`}>
                {t(getStatusText(nutritionData.summary.totalCarbs, goals.carbs).toLowerCase())}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>{t('fat')}</h3>
              <span className="metric-value">{nutritionData.summary.totalFat}g</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((nutritionData.summary.totalFat / goals.fat) * 100, 100)}%`,
                  backgroundColor: getProgressColor(nutritionData.summary.totalFat, goals.fat)
                }}
              />
            </div>
            <div className="metric-target">
              Target: {goals.fat}g
              <span className={`status ${getStatusText(nutritionData.summary.totalFat, goals.fat).toLowerCase()}`}>
                {t(getStatusText(nutritionData.summary.totalFat, goals.fat).toLowerCase())}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-section">
          <h2>{t('daily_calorie_trend')}</h2>
          <div className="calorie-chart">
            <div className="chart-container">
              {nutritionData.dailyBreakdown.map((day, index) => (
                <div key={index} className="chart-bar">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${(day.calories / 2000) * 100}%`,
                      backgroundColor: getProgressColor(day.calories, goals.calories)
                    }}
                  />
                  <div className="bar-label">{new Date(day.date).getDate()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="meal-distribution">
          <h2>{t('meal_distribution')}</h2>
          <div className="distribution-chart">
            {Object.entries(nutritionData.mealDistribution).map(([meal, percentage]) => (
              <div key={meal} className="distribution-item">
                <div className="meal-label">
                  <span className="meal-name">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                  <span className="meal-percentage">{percentage}%</span>
                </div>
                <div className="distribution-bar">
                  <div
                    className="distribution-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-ingredients">
          <h2>{t('most_used_ingredients')}</h2>
          <div className="ingredients-list">
            {nutritionData.topIngredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <div className="ingredient-info">
                  <h4>{ingredient.name}</h4>
                  <span className="ingredient-amount">
                    {ingredient.amount}{ingredient.unit}
                  </span>
                </div>
                <div className="ingredient-nutrition">
                  {ingredient.nutrition.calories && (
                    <span>{ingredient.nutrition.calories} {t('cal')}</span>
                  )}
                  {ingredient.nutrition.protein && (
                    <span>{ingredient.nutrition.protein}g {t('protein_unit')}</span>
                  )}
                  {ingredient.nutrition.carbs && (
                    <span>{ingredient.nutrition.carbs}g {t('carbs_unit')}</span>
                  )}
                  {ingredient.nutrition.fat && (
                    <span>{ingredient.nutrition.fat}g {t('fat_unit')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="deficiencies-alert">
          <h2>{t('nutrient_status')}</h2>
          <div className="deficiencies-list">
            {nutritionData.deficiencies.map((deficiency, index) => (
              <div key={index} className={`deficiency-item ${deficiency.status}`}>
                <div className="deficiency-info">
                  <h4>{deficiency.nutrient}</h4>
                  <span className="current-value">
                    {deficiency.current} / {deficiency.recommended} {deficiency.nutrient.includes('Vitamin') ? t('iu') : t('mg')}
                  </span>
                </div>
                <div className="deficiency-status">
                  <span className={`status-badge ${deficiency.status}`}>
                    {deficiency.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="goals-section">
        <h2>{t('adjust_your_goals')}</h2>
        <div className="goals-form">
          <div className="goal-input">
            <label>{t('daily_calories')}</label>
            <input
              type="number"
              value={goals.calories}
              onChange={(e) => setGoals({...goals, calories: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="goal-input">
            <label>{t('protein_g')}</label>
            <input
              type="number"
              value={goals.protein}
              onChange={(e) => setGoals({...goals, protein: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="goal-input">
            <label>{t('carbohydrates_g')}</label>
            <input
              type="number"
              value={goals.carbs}
              onChange={(e) => setGoals({...goals, carbs: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="goal-input">
            <label>{t('fat_g')}</label>
            <input
              type="number"
              value={goals.fat}
              onChange={(e) => setGoals({...goals, fat: parseInt(e.target.value) || 0})}
            />
          </div>
          <button
            className="update-goals-btn"
            onClick={() => updateGoals(goals)}
          >
            {t('update_goals')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionAnalytics;