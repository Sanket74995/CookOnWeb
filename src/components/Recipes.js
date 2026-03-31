import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Recipes.scss';
import RecipeCard from './RecipeCard';
import { API_BASE } from '../config';
import Loader from './Loader';

const API = `${API_BASE}/api/recipes`;
const AUTH_API = `${API_BASE}/api/auth`;
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

const CustomDropdown = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedOption = options.find((option) => option.value === value);
    const buttonLabel = selectedOption?.label || placeholder;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!dropdownRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className={`custom-dropdown ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
            <button
                type="button"
                className="dropdown-button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={label}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{buttonLabel}</span>
                <span className="dropdown-chevron" aria-hidden="true">⌄</span>
            </button>

            {isOpen && (
                <div className="dropdown-menu" role="listbox" aria-label={label}>
                    {options.map((option) => (
                        <button
                            key={`${label}-${option.value || 'empty'}`}
                            type="button"
                            role="option"
                            className={`dropdown-option ${option.value === value ? 'is-selected' : ''}`}
                            aria-selected={option.value === value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
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
                const response = await fetch(`${AUTH_API}/favorites`, {
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
        const url = `${AUTH_API}/favorites/${recipeId}`;
        const method = isFav ? 'DELETE' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                setFavorites((prev) => isFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]);
            } else {
                const data = await response.json().catch(() => ({}));
                alert(data.message || 'Unable to save recipe');
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

    const cuisineOptions = useMemo(
        () => [
            { value: '', label: t('all_cuisines') },
            ...cuisines.map((cuisine) => ({ value: cuisine, label: cuisine }))
        ],
        [cuisines, t]
    );

    const difficultyOptions = useMemo(
        () => [
            { value: '', label: t('all_levels') },
            { value: 'easy', label: t('easy') },
            { value: 'medium', label: t('medium') },
            { value: 'hard', label: t('hard') }
        ],
        [t]
    );

    const dietaryOptions = useMemo(
        () => [
            { value: '', label: t('all_dietary_styles') },
            ...DIETARY_OPTIONS.map((option) => ({ value: option, label: option }))
        ],
        [t]
    );

    const maxTimeOptions = useMemo(
        () => [
            { value: '', label: t('any_time') },
            { value: '15', label: `15 ${t('min')}` },
            { value: '30', label: `30 ${t('min')}` },
            { value: '45', label: `45 ${t('min')}` },
            { value: '60', label: `60 ${t('min')}` }
        ],
        [t]
    );

    const minRatingOptions = useMemo(
        () => [
            { value: '', label: t('any_rating') },
            { value: '4', label: '4+' },
            { value: '3', label: '3+' },
            { value: '2', label: '2+' }
        ],
        [t]
    );

    const sortOptions = useMemo(
        () => [
            { value: 'latest', label: t('latest') },
            { value: 'rating', label: t('top_rated') },
            { value: 'popular', label: t('most_reviewed') },
            { value: 'time', label: t('quickest') }
        ],
        [t]
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
        return <Loader label={t('loading_recipes')} variant="page" />;
    }

    return (
        <div className="recipes-container">
            <div className="recipes-header">
                <h1>{t('all_recipes')}</h1>
                <p>{t('discover_recipes')}</p>
            </div>

            {localStorage.getItem('token') && recommended.length > 0 && (
                <section className="cuisine-section">
                    <h2>{t('recommended_for_you')}</h2>
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
                    <CustomDropdown
                        label={t('cuisine_filter')}
                        value={filters.cuisine}
                        options={cuisineOptions}
                        placeholder={t('all_cuisines')}
                        onChange={(nextValue) => updateFilter('cuisine', nextValue)}
                    />
                </div>

                <div className="filter-item">
                    <label>{t('difficulty_filter')}</label>
                    <CustomDropdown
                        label={t('difficulty_filter')}
                        value={filters.difficulty}
                        options={difficultyOptions}
                        placeholder={t('all_levels')}
                        onChange={(nextValue) => updateFilter('difficulty', nextValue)}
                    />
                </div>

                <div className="filter-item">
                    <label>{t('dietary_filter')}</label>
                    <CustomDropdown
                        label={t('dietary_filter')}
                        value={filters.dietary}
                        options={dietaryOptions}
                        placeholder={t('all_dietary_styles')}
                        onChange={(nextValue) => updateFilter('dietary', nextValue)}
                    />
                </div>

                <div className="filter-item">
                    <label>{t('max_total_time')}</label>
                    <CustomDropdown
                        label={t('max_total_time')}
                        value={filters.maxTime}
                        options={maxTimeOptions}
                        placeholder={t('any_time')}
                        onChange={(nextValue) => updateFilter('maxTime', nextValue)}
                    />
                </div>

                <div className="filter-item">
                    <label>{t('min_rating')}</label>
                    <CustomDropdown
                        label={t('min_rating')}
                        value={filters.minRating}
                        options={minRatingOptions}
                        placeholder={t('any_rating')}
                        onChange={(nextValue) => updateFilter('minRating', nextValue)}
                    />
                </div>

                <div className="filter-item">
                    <label>{t('sort_by')}</label>
                    <CustomDropdown
                        label={t('sort_by')}
                        value={filters.sort}
                        options={sortOptions}
                        placeholder={t('latest')}
                        onChange={(nextValue) => updateFilter('sort', nextValue)}
                    />
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
