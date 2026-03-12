import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Recipes.scss';
import RecipeCard from './RecipeCard';

const API = 'http://localhost:5000/api/recipes';
const normalizeCuisine = (value) => (value || '').trim().toLowerCase();
const formatCuisineLabel = (value) => {
    const normalized = normalizeCuisine(value);
    if (!normalized) return 'Other';
    return normalized
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const Recipes = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [foodProfile, setFoodProfile] = useState(null);
    const [filters, setFilters] = useState({
        query: '',
        cuisine: '',
        difficulty: '',
        maxTime: '',
        minRating: '',
        sort: 'latest'
    });
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [useFoodPlan, setUseFoodPlan] = useState(false);

    useEffect(() => {
        const searchRecipes = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) {
                        params.set(key, value);
                    }
                });

                const endpoint = params.toString() ? `${API}/search?${params.toString()}` : API;
                const response = await fetch(endpoint);
                const data = await response.json();
                if (response.ok) {
                    setRecipes(data);
                } else {
                    console.error('Failed to fetch recipes');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        searchRecipes();
    }, [filters]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchFavorites = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data.map((recipe) => recipe._id));
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchRecommended = async () => {
            try {
                const response = await fetch(`${API}/recommended`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setRecommended(data.recipes || []);
                    setFoodProfile(data.foodProfile || null);
                }
            } catch (error) {
                console.error('Error fetching recommended recipes:', error);
            }
        };

        fetchRecommended();
    }, []);

    const toggleFavorite = async (recipeId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const isFav = favorites.includes(recipeId);
        const url = `http://localhost:5000/api/auth/favorites/${recipeId}`;
        const method = isFav ? 'DELETE' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setFavorites((prev) => isFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const displayedRecipes = useMemo(() => {
        const source = useFoodPlan ? recommended : recipes;
        if (!showOnlyFavorites) return source;
        return source.filter((recipe) => favorites.includes(recipe._id));
    }, [favorites, recipes, recommended, showOnlyFavorites, useFoodPlan]);

    const cuisines = useMemo(
        () => [...new Set(recipes.map((recipe) => normalizeCuisine(recipe.cuisine)).filter(Boolean))]
            .map((value) => formatCuisineLabel(value))
            .sort(),
        [recipes]
    );

    const groupedRecipes = useMemo(() => {
        return displayedRecipes.reduce((acc, recipe) => {
            const normalizedKey = normalizeCuisine(recipe.cuisine);
            const key = normalizedKey || 'other';
            if (!acc[key]) {
                acc[key] = {
                    label: formatCuisineLabel(recipe.cuisine),
                    recipes: []
                };
            }
            acc[key].recipes.push(recipe);
            return acc;
        }, {});
    }, [displayedRecipes]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return <div className="recipes-loading">{t('loading_recipes')}</div>;
    }

    return (
        <div className="recipes-container">
            <div className="recipes-header">
                <h1>{t('all_recipes')}</h1>
                <p>{t('discover_recipes')}</p>
            </div>

            {localStorage.getItem('token') && recommended.length > 0 && (
                <section className="cuisine-section">
                    <h2>
                        Recommended For {foodProfile?.goal ? foodProfile.goal.replace(/-/g, ' ') : 'You'}
                    </h2>
                    <div className="recipes-empty" style={{ marginBottom: '20px', textAlign: 'left' }}>
                        Personalized using your food plan, health conditions, and ingredient preferences from Settings.
                    </div>
                    <div className="cuisine-recipes">
                        {recommended.map((recipe) => (
                            <div
                                key={recipe._id}
                                onClick={() => navigate(`/recipe/${recipe._id}`)}
                                className="recipe-card-wrapper"
                            >
                                <RecipeCard
                                    recipe={recipe}
                                    isFavorited={favorites.includes(recipe._id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="filters-section filters-section--grid">
                <div className="filter-item">
                    <label htmlFor="search">{t('search')}:</label>
                    <input
                        type="text"
                        id="search"
                        placeholder={t('search_placeholder')}
                        value={filters.query}
                        onChange={(e) => updateFilter('query', e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label>Cuisine:</label>
                    <select value={filters.cuisine} onChange={(e) => updateFilter('cuisine', e.target.value)}>
                        <option value="">All cuisines</option>
                        {cuisines.map((cuisine) => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Difficulty:</label>
                    <select value={filters.difficulty} onChange={(e) => updateFilter('difficulty', e.target.value)}>
                        <option value="">All levels</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Max total time:</label>
                    <select value={filters.maxTime} onChange={(e) => updateFilter('maxTime', e.target.value)}>
                        <option value="">Any time</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Min rating:</label>
                    <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
                        <option value="">Any rating</option>
                        <option value="4">4+</option>
                        <option value="3">3+</option>
                        <option value="2">2+</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Sort by:</label>
                    <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                        <option value="latest">Latest</option>
                        <option value="rating">Top rated</option>
                        <option value="popular">Most reviewed</option>
                        <option value="time">Quickest</option>
                    </select>
                </div>

                {localStorage.getItem('token') && (
                    <div className="filter-item filter-item--checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={showOnlyFavorites}
                                onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                            />
                            Show only favorites
                        </label>
                    </div>
                )}

                {localStorage.getItem('token') && recommended.length > 0 && (
                    <div className="filter-item filter-item--checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={useFoodPlan}
                                onChange={(e) => setUseFoodPlan(e.target.checked)}
                            />
                            Use my food plan
                        </label>
                    </div>
                )}

                <div className="filter-item">
                    <button
                        className="reset-button"
                        onClick={() => {
                            setFilters({
                                query: '',
                                cuisine: '',
                                difficulty: '',
                                maxTime: '',
                                minRating: '',
                                sort: 'latest'
                            });
                            setShowOnlyFavorites(false);
                            setUseFoodPlan(false);
                        }}
                    >
                        {t('reset_filters')}
                    </button>
                </div>
            </div>

            {displayedRecipes.length === 0 ? (
                <div className="recipes-empty">
                    No recipes matched these filters. Try broadening the search.
                </div>
            ) : (
                Object.entries(groupedRecipes).map(([cuisineKey, group]) => (
                    <section key={cuisineKey} className="cuisine-section">
                        <h2>{t(group.label.toLowerCase()) || group.label}</h2>
                        <div className="cuisine-recipes">
                            {group.recipes.map((recipe) => (
                                <div
                                    key={recipe._id}
                                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                                    className="recipe-card-wrapper"
                                >
                                    <RecipeCard
                                        recipe={recipe}
                                        isFavorited={favorites.includes(recipe._id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
};

export default Recipes;
