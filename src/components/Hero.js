import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Hero.scss';
import RecipeCard from './RecipeCard';

const Hero = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recipes');
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data); // Take all recipes
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

    const handleRecipeClick = (recipeId) => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // User is logged in, navigate to recipe detail page
            navigate(`/recipe/${recipeId}`);
        } else {
            // User is not logged in, navigate to register page
            navigate('/register');
        }
    };

    // Filter and group recipes by specific cuisines
    const recipesByCuisine = useMemo(() => {
        const targetCuisines = ['Indian', 'Italian', 'Japanese'];
        const grouped = {};

        // Initialize the target cuisines
        targetCuisines.forEach(cuisine => {
            grouped[cuisine] = [];
        });

        // Filter and group recipes
        recipes.forEach(recipe => {
            if (targetCuisines.includes(recipe.cuisine)) {
                grouped[recipe.cuisine].push(recipe);
            }
        });

        return grouped;
    }, [recipes]);

    if (loading) {
        return (
            <div className="hero-loading">
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
                    <div className="hero-button-placeholder">Loading recipes...</div>
                </div>
            </div>
        );
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
                <button className="hero-button" onClick={() => navigate('/register')}>
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
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* See More Section */}
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
