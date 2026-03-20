import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/AIRecommendations.scss';
import Loader from './Loader';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    dietaryRestrictions: [],
    cuisinePreferences: [],
    skillLevel: 'intermediate',
    availableIngredients: []
  });
  const [currentFilters, setCurrentFilters] = useState({
    time: 'any',
    difficulty: 'any',
    cuisine: 'any'
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadUserPreferences();
    generateRecommendations();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:5000/api/user/preferences', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const preferences = await response.json();
          setUserPreferences(preferences);
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recipes/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          preferences: userPreferences,
          filters: currentFilters
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } else {
        // Fallback to mock recommendations
        setRecommendations(getMockRecommendations());
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations(getMockRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const getMockRecommendations = () => {
    return [
      {
        _id: '1',
        title: 'Creamy Mushroom Risotto',
        description: 'A rich and creamy Italian rice dish perfect for dinner',
        image: '/images/recipe1.jpg',
        prepTime: 15,
        cookTime: 30,
        difficulty: 'intermediate',
        cuisine: 'Italian',
        rating: 4.8,
        matchReason: 'Based on your preference for Italian cuisine and available mushrooms',
        ingredients: ['Arborio rice', 'Mushrooms', 'Parmesan', 'White wine', 'Onion']
      },
      {
        _id: '2',
        title: 'Thai Green Curry',
        description: 'Aromatic and spicy Thai curry with coconut milk',
        image: '/images/recipe2.jpg',
        prepTime: 20,
        cookTime: 25,
        difficulty: 'intermediate',
        cuisine: 'Thai',
        rating: 4.6,
        matchReason: 'Matches your spice tolerance and includes vegetables you enjoy',
        ingredients: ['Green curry paste', 'Coconut milk', 'Chicken', 'Thai basil', 'Bell peppers']
      },
      {
        _id: '3',
        title: 'Classic Chocolate Chip Cookies',
        description: 'Soft and chewy cookies perfect for dessert',
        image: '/images/recipe3.jpg',
        prepTime: 15,
        cookTime: 12,
        difficulty: 'easy',
        cuisine: 'American',
        rating: 4.9,
        matchReason: 'Quick and easy recipe that matches your baking preferences',
        ingredients: ['Flour', 'Butter', 'Chocolate chips', 'Brown sugar', 'Vanilla extract']
      }
    ];
  };

  const handleFilterChange = (filterType, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    // Regenerate recommendations with new filters
    setTimeout(() => generateRecommendations(), 300);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const updateUserPreferences = async (newPreferences) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/user/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newPreferences)
        });
        setUserPreferences(newPreferences);
        generateRecommendations();
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (loading) {
    return <Loader label={t('analyzing_preferences')} variant="page" />;
  }

  return (
    <div className="ai-recommendations">
      <div className="recommendations-header">
        <h1>{t('ai_recipe_recommendations')}</h1>
        <p>{t('personalized_recipes_subtitle')}</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>{t('cooking_time')}</label>
          <select
            value={currentFilters.time}
            onChange={(e) => handleFilterChange('time', e.target.value)}
          >
            <option value="any">{t('any_time')}</option>
            <option value="quick">{t('under_30_min')}</option>
            <option value="medium">{t('30_60_min')}</option>
            <option value="long">{t('over_60_min')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('difficulty')}</label>
          <select
            value={currentFilters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          >
            <option value="any">{t('any_level')}</option>
            <option value="easy">{t('easy')}</option>
            <option value="intermediate">{t('intermediate')}</option>
            <option value="advanced">{t('advanced')}</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{t('cuisine')}</label>
          <select
            value={currentFilters.cuisine}
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
          >
            <option value="any">{t('any_cuisine')}</option>
            <option value="Italian">{t('italian')}</option>
            <option value="Indian">{t('indian')}</option>
            <option value="Chinese">{t('chinese')}</option>
            <option value="Mexican">{t('mexican')}</option>
            <option value="Thai">{t('thai')}</option>
            <option value="American">{t('american')}</option>
          </select>
        </div>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((recipe) => (
          <div
            key={recipe._id}
            className="recommendation-card"
            onClick={() => handleRecipeClick(recipe._id)}
          >
            <div className="recipe-image">
              <img src={recipe.image} alt={recipe.title} />
              <div className="recipe-rating">
                <span className="stars">{'★'.repeat(Math.floor(recipe.rating))}</span>
                <span className="rating-number">{recipe.rating}</span>
              </div>
            </div>

            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <p className="recipe-description">{recipe.description}</p>

              <div className="recipe-meta">
                <span className="time">
                  <i className="fas fa-clock"></i>
                  {recipe.prepTime + recipe.cookTime} {t('min')}
                </span>
                <span className="difficulty">
                  <i className="fas fa-chart-line"></i>
                  {recipe.difficulty}
                </span>
                <span className="cuisine">
                  <i className="fas fa-globe"></i>
                  {recipe.cuisine}
                </span>
              </div>

              <div className="match-reason">
                <i className="fas fa-lightbulb"></i>
                <span>{recipe.matchReason}</span>
              </div>

              <div className="ingredients-preview">
                <strong>{t('key_ingredients')}</strong> {recipe.ingredients.slice(0, 3).join(', ')}
                {recipe.ingredients.length > 3 && '...'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="no-recommendations">
          <i className="fas fa-search"></i>
          <h3>{t('no_recommendations_found')}</h3>
          <p>{t('try_adjusting_filters')}</p>
        </div>
      )}

      <div className="preferences-section">
        <h2>{t('update_your_preferences')}</h2>
        <div className="preferences-form">
          <div className="preference-group">
            <label>{t('dietary_restrictions')}</label>
            <div className="checkbox-group">
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'].map(restriction => (
                <label key={restriction} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={userPreferences.dietaryRestrictions.includes(restriction)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...userPreferences.dietaryRestrictions, restriction]
                        : userPreferences.dietaryRestrictions.filter(r => r !== restriction);
                      updateUserPreferences({...userPreferences, dietaryRestrictions: updated});
                    }}
                  />
                  {restriction}
                </label>
              ))}
            </div>
          </div>

          <div className="preference-group">
            <label>{t('favorite_cuisines')}</label>
            <div className="checkbox-group">
              {['Italian', 'Indian', 'Chinese', 'Mexican', 'Thai', 'American', 'French', 'Japanese'].map(cuisine => (
                <label key={cuisine} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={userPreferences.cuisinePreferences.includes(cuisine)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...userPreferences.cuisinePreferences, cuisine]
                        : userPreferences.cuisinePreferences.filter(c => c !== cuisine);
                      updateUserPreferences({...userPreferences, cuisinePreferences: updated});
                    }}
                  />
                  {cuisine}
                </label>
              ))}
            </div>
          </div>

          <div className="preference-group">
            <label>{t('cooking_skill_level')}</label>
            <select
              value={userPreferences.skillLevel}
              onChange={(e) => updateUserPreferences({...userPreferences, skillLevel: e.target.value})}
            >
              <option value="beginner">{t('beginner')}</option>
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
