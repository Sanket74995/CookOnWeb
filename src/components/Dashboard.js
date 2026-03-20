import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config';
import '../styles/Dashboard.scss';
import Loader from './Loader';

const Dashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalRecipes: 0,
        totalFavorites: 0,
        totalCollections: 0,
        totalReviews: 0,
        averageRating: '0.0'
    });
    const [loading, setLoading] = useState(true);
    const [recentRecipes, setRecentRecipes] = useState([]);
    const [favoriteCuisines, setFavoriteCuisines] = useState([]);
    const [cookingHabits, setCookingHabits] = useState({
        totalPrepTime: 0,
        totalCookTime: 0,
        difficultyBreakdown: {},
        categoryBreakdown: {}
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch user recipes
            const recipesResponse = await fetch(`${API_BASE}/api/recipes/mine`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const recipesData = recipesResponse.ok ? await recipesResponse.json() : [];

            // Fetch favorites
            const favoritesResponse = await fetch(`${API_BASE}/api/auth/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const favoritesData = favoritesResponse.ok ? await favoritesResponse.json() : [];

            // Fetch collections
            const collectionsResponse = await fetch(`${API_BASE}/api/collections`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const collectionsData = collectionsResponse.ok ? await collectionsResponse.json() : [];

            // Calculate stats
            const totalRecipes = recipesData.length;
            const totalFavorites = favoritesData.length;
            const totalCollections = collectionsData.length;
            const totalReviews = recipesData.reduce((sum, recipe) => sum + (recipe.reviews?.length || 0), 0);
            const averageRating = recipesData.length > 0
                ? recipesData.reduce((sum, recipe) => sum + (recipe.rating?.average || 0), 0) / recipesData.length
                : 0;

            // Recent recipes (last 5)
            const recent = recipesData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            // Favorite cuisines
            const cuisineCount = {};
            favoritesData.forEach(recipe => {
                const cuisine = recipe.cuisine || 'Other';
                cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
            });
            const topCuisines = Object.entries(cuisineCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([cuisine, count]) => ({ cuisine, count }));

            // Cooking habits
            const habits = {
                totalCookTime: recipesData.reduce((sum, recipe) => sum + (recipe.cookTime || 0), 0),
                totalPrepTime: recipesData.reduce((sum, recipe) => sum + (recipe.prepTime || 0), 0),
                difficultyBreakdown: recipesData.reduce((acc, recipe) => {
                    const diff = recipe.difficulty || 'medium';
                    acc[diff] = (acc[diff] || 0) + 1;
                    return acc;
                }, {}),
                categoryBreakdown: recipesData.reduce((acc, recipe) => {
                    const cat = recipe.category || 'main course';
                    acc[cat] = (acc[cat] || 0) + 1;
                    return acc;
                }, {})
            };

            setStats({
                totalRecipes,
                totalFavorites,
                totalCollections,
                totalReviews,
                averageRating: averageRating.toFixed(1)
            });
            setRecentRecipes(recent);
            setFavoriteCuisines(topCuisines);
            setCookingHabits(habits);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Set default values on error
            setStats({
                totalRecipes: 0,
                totalFavorites: 0,
                totalCollections: 0,
                totalReviews: 0,
                averageRating: '0.0'
            });
            setRecentRecipes([]);
            setFavoriteCuisines([]);
            setCookingHabits({
                totalPrepTime: 0,
                totalCookTime: 0,
                difficultyBreakdown: {},
                categoryBreakdown: {}
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="dashboard-page">
                <Loader label={t('loading_dashboard')} variant="section" />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>{t('your_cooking_dashboard')}</h1>
                <p>{t('dashboard_subtitle')}</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{stats.totalRecipes}</div>
                    <div className="stat-label">{t('recipes_created')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalFavorites}</div>
                    <div className="stat-label">{t('favorite_recipes')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalCollections}</div>
                    <div className="stat-label">{t('collections')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.averageRating}</div>
                    <div className="stat-label">{t('avg_rating')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalReviews}</div>
                    <div className="stat-label">{t('reviews_received')}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{Math.round(((cookingHabits?.totalPrepTime || 0) + (cookingHabits?.totalCookTime || 0)) / 60)}h</div>
                    <div className="stat-label">{t('total_cooking_time')}</div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-section">
                    <h2>{t('recent_recipes')}</h2>
                    {recentRecipes.length === 0 ? (
                        <p>{t('no_recipes_yet')} <a href="/add-recipe">{t('create_first_recipe')}</a></p>
                    ) : (
                        <div className="recent-recipes">
                            {recentRecipes.map(recipe => (
                                <div key={recipe._id} className="recent-recipe-card" onClick={() => navigate(`/recipe/${recipe._id}`)}>
                                    <img src={`${API_BASE}${recipe.image}`} alt={recipe.title} />
                                    <div className="recipe-info">
                                        <h4>{recipe.title}</h4>
                                        <p>{recipe.cuisine} • {recipe.category}</p>
                                        <div className="recipe-meta">
                                            <span>★ {recipe.rating?.average?.toFixed(1) || 'N/A'}</span>
                                            <span>{recipe.reviews?.length || 0} {t('reviews')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <h2>{t('favorite_cuisines')}</h2>
                    {favoriteCuisines.length === 0 ? (
                        <p>{t('add_favorites_to_see_cuisines')}</p>
                    ) : (
                        <div className="cuisine-chart">
                            {favoriteCuisines.map(({ cuisine, count }) => (
                                <div key={cuisine} className="cuisine-item">
                                    <span className="cuisine-name">{cuisine}</span>
                                    <div className="cuisine-bar">
                                        <div
                                            className="cuisine-fill"
                                            style={{ width: `${favoriteCuisines.length > 0 ? (count / favoriteCuisines[0].count) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="cuisine-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <h2>{t('cooking_habits')}</h2>
                    <div className="habits-grid">
                        <div className="habit-item">
                            <h4>{t('difficulty_distribution')}</h4>
                            <div className="habit-stats">
                                {Object.entries(cookingHabits?.difficultyBreakdown || {}).map(([difficulty, count]) => (
                                    <div key={difficulty} className="habit-stat">
                                        <span className="habit-label">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                                        <span className="habit-value">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="habit-item">
                            <h4>{t('recipe_categories')}</h4>
                            <div className="habit-stats">
                                {Object.entries(cookingHabits?.categoryBreakdown || {}).map(([category, count]) => (
                                    <div key={category} className="habit-stat">
                                        <span className="habit-label">{category.replace('-', ' ')}</span>
                                        <span className="habit-value">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
