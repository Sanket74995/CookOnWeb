import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Recipes.scss';
import RecipeCard from './RecipeCard';

const API = 'http://localhost:5000/api/recipes';
const DEFAULT_FILTERS = {
    query: '',
    cuisine: '',
    difficulty: '',
    dietary: '',
    maxTime: '',
    minRating: '',
    sort: 'latest'
};
const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'high-protein', 'low-carb', 'diabetic-friendly', 'heart-healthy'];
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
    const [isSearching, setIsSearching] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [foodProfile, setFoodProfile] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [searchInput, setSearchInput] = useState(DEFAULT_FILTERS.query);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [useFoodPlan, setUseFoodPlan] = useState(false);
    const [generatorInput, setGeneratorInput] = useState('');
    const [generatorDietary, setGeneratorDietary] = useState([]);
    const [generatorResult, setGeneratorResult] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilters((prev) => prev.query === searchInput ? prev : { ...prev, query: searchInput });
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    useEffect(() => {
        const searchRecipes = async () => {
            try {
                setIsSearching(true);
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
                setIsSearching(false);
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

    const toggleDietaryOption = (option) => {
        setGeneratorDietary((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const generateFromIngredients = async () => {
        if (!generatorInput.trim()) {
            alert(t('enter_ingredients_first'));
            return;
        }

        try {
            setGenerating(true);
            const response = await fetch(`${API}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ingredients: generatorInput,
                    dietaryFilters: generatorDietary,
                    maxTime: filters.maxTime || undefined,
                    cuisine: filters.cuisine || undefined
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate recipe idea');
            }
            setGeneratorResult(data);
        } catch (error) {
            console.error('Ingredient recipe generation failed:', error);
            alert(error.message || t('unable_generate_recipe_idea'));
        } finally {
            setGenerating(false);
        }
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
                        {t('recommended_for_you')}
                    </h2>
                    <div className="recipes-empty" style={{ marginBottom: '20px', textAlign: 'left' }}>
                        {t('personalized_using_food_plan')}
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
                <div className="filter-item" style={{ gridColumn: '1 / -1' }}>
                    <label>{t('pantry_to_recipe_generator')}</label>
                    <input
                        type="text"
                        value={generatorInput}
                        onChange={(e) => setGeneratorInput(e.target.value)}
                        placeholder={t('example_ingredients')}
                    />
                    <div className="tags-list" style={{ marginTop: '10px' }}>
                        {DIETARY_OPTIONS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                className="reset-button"
                                style={{
                                    marginRight: '8px',
                                    marginBottom: '8px',
                                    opacity: generatorDietary.includes(option) ? 1 : 0.7
                                }}
                                onClick={() => toggleDietaryOption(option)}
                            >
                                {generatorDietary.includes(option) ? t('selected') : t('add')} {option}
                            </button>
                        ))}
                    </div>
                    <button className="reset-button" type="button" onClick={generateFromIngredients} disabled={generating}>
                        {generating ? t('generating') : t('generate_recipe_idea')}
                    </button>
                </div>

                {generatorResult?.generatedRecipe && (
                    <div className="recipes-empty" style={{ gridColumn: '1 / -1', textAlign: 'left' }}>
                        <strong>{t('generated_idea')}</strong> {generatorResult.generatedRecipe.title}
                        <br />
                        {generatorResult.generatedRecipe.description}
                        <br />
                        <strong>{t('ingredients')}:</strong> {generatorResult.generatedRecipe.ingredients.map((item) => `${item.quantity} ${item.unit} ${item.name}`.trim()).join(', ')}
                    </div>
                )}

                <div className="filter-item">
                    <label htmlFor="search">{t('search')}:</label>
                    <input
                        type="text"
                        id="search"
                        placeholder={t('search_placeholder')}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {isSearching && <div className="filter-status">{t('searching')}</div>}
                </div>

                <div className="filter-item">
                    <label>{t('cuisine_filter')}</label>
                    <select value={filters.cuisine} onChange={(e) => updateFilter('cuisine', e.target.value)}>
                        <option value="">{t('all_cuisines')}</option>
                        {cuisines.map((cuisine) => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>{t('difficulty_filter')}</label>
                    <select value={filters.difficulty} onChange={(e) => updateFilter('difficulty', e.target.value)}>
                        <option value="">{t('all_levels')}</option>
                        <option value="easy">{t('easy')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="hard">{t('hard')}</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>{t('dietary_filter')}</label>
                    <select value={filters.dietary} onChange={(e) => updateFilter('dietary', e.target.value)}>
                        <option value="">{t('all_dietary_styles')}</option>
                        {DIETARY_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>{t('max_total_time')}</label>
                    <select value={filters.maxTime} onChange={(e) => updateFilter('maxTime', e.target.value)}>
                        <option value="">{t('any_time')}</option>
                        <option value="15">15 {t('min')}</option>
                        <option value="30">30 {t('min')}</option>
                        <option value="45">45 {t('min')}</option>
                        <option value="60">60 {t('min')}</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>{t('min_rating')}</label>
                    <select value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
                        <option value="">{t('any_rating')}</option>
                        <option value="4">4+</option>
                        <option value="3">3+</option>
                        <option value="2">2+</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>{t('sort_by')}</label>
                    <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                        <option value="latest">{t('latest')}</option>
                        <option value="rating">{t('top_rated')}</option>
                        <option value="popular">{t('most_reviewed')}</option>
                        <option value="time">{t('quickest')}</option>
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
                            {t('show_only_favorites')}
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
                            {t('use_my_food_plan')}
                        </label>
                    </div>
                )}

                <div className="filter-item">
                    <button
                        className="reset-button"
                        onClick={() => {
                            setFilters(DEFAULT_FILTERS);
                            setSearchInput(DEFAULT_FILTERS.query);
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
                    {t('no_recipes_matched')}
                </div>
            ) : (
                <>
                    {generatorResult?.matchedRecipes?.length > 0 && (
                        <section className="cuisine-section">
                            <h2>{t('best_pantry_matches')}</h2>
                            <div className="cuisine-recipes">
                                {generatorResult.matchedRecipes.map((recipe) => (
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
                    {Object.entries(groupedRecipes).map(([cuisineKey, group]) => (
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
                    ))}
                </>
            )}
        </div>
    );
};

export default Recipes;
