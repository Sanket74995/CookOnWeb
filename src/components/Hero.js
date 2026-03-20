import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Hero.scss';
import RecipeCard from './RecipeCard';
import { API_BASE } from '../config';
import Loader from './Loader';

const Hero = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/recipes`);
                if (response.ok) {
                    const data = await response.json();
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
        fetchRecipes();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchFavorites();
        }
    }, []);

    const fetchFavorites = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE}/api/auth/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setFavorites(data.map(recipe => recipe._id));
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const toggleFavorite = async (recipeId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const isFav = favorites.includes(recipeId);
        const url = `${API_BASE}/api/auth/favorites/${recipeId}`;
        const method = isFav ? 'DELETE' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                if (isFav) {
                    setFavorites(prev => prev.filter(id => id !== recipeId));
                } else {
                    setFavorites(prev => [...prev, recipeId]);
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleRecipeClick = (recipeId) => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate(`/recipe/${recipeId}`);
        } else {
            navigate('/register');
        }
    };

    const handleGetStarted = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/recipes');
        } else {
            navigate('/register');
        }
    };

    const recipesByCuisine = useMemo(() => {
        const targetCuisines = ['Indian', 'Italian', 'Japanese'];
        const grouped = {};

        targetCuisines.forEach(cuisine => {
            grouped[cuisine] = [];
        });

        recipes.forEach(recipe => {
            if (targetCuisines.includes(recipe.cuisine)) {
                grouped[recipe.cuisine].push(recipe);
            }
        });

        return grouped;
    }, [recipes]);

    if (loading) {
        return <Loader label={t('loading_recipes')} variant="page" size="lg" />;
    }

    return (
        <>
            <div className="hero">
                <div className="floating-icons">
                    <span className="food-icon icon-1">🍕</span>
                    <span className="food-icon icon-2">🥗</span>
                    <span className="food-icon icon-3">🍩</span>
                    <span className="food-icon icon-4">🍔</span>
                    <span className="food-icon icon-5">🌮</span>
                    <span className="food-icon icon-6">🍰</span>
                </div>

                <h1>{t('welcome')} <span className="highlight">CookOnWeb</span></h1>
                <p>{t('where_recipes_speak')}</p>
                <button className="hero-button" onClick={handleGetStarted}>
                    {t('get_started')}
                </button>
            </div>

            <div className="hero-recipes-container">
                {Object.entries(recipesByCuisine).map(([cuisine, cuisineRecipes]) => (
                    <section key={cuisine} className="cuisine-section">
                        <h2>{t(cuisine.toLowerCase()) || cuisine}</h2>
                        <div className="cuisine-recipes">
                            {cuisineRecipes.map(recipe => (
                                <div
                                    key={recipe._id}
                                    onClick={() => handleRecipeClick(recipe._id)}
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

                <div className="see-more-section">
                    <button
                        className="see-more-button"
                        onClick={() => navigate('/recipes')}
                    >
                        <span className="see-more-text">{t('see_all_recipes')}</span>
                        <span className="see-more-arrow">→</span>
                    </button>
                    <p className="see-more-subtitle">{t('discover_recipes')}</p>
                </div>
            </div>
        </>
    );
};

export default Hero;
