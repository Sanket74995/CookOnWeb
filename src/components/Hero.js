import React, { useEffect, useState } from 'react';
import './../styles/Hero.scss';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RecipeCard from './RecipeCard';

const Hero = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recipes?limit=4');
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data.slice(0, 4)); // Take first 4 recipes
                } else {
                    console.error('Failed to fetch recipes');
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, []);

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
                <Link to="/register" className={`hero-button ${location.pathname === '/register' ? 'active' : ''}`}>
                    {t('get_started')}
                </Link>
            </div>

            <div className="recipe-cards-container">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
            </div>
        </>
    );
};

export default Hero;
