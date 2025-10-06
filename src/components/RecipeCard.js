import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/RecipeCard.scss';

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';

    const handleViewRecipe = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/recipes');
        } else {
            navigate('/login');
        }
    };

    // Determine title and description based on current language and translations
    const title = currentLang !== 'en' && recipe.translations && recipe.translations[currentLang] && recipe.translations[currentLang].title
        ? recipe.translations[currentLang].title
        : recipe.title;

    const description = currentLang !== 'en' && recipe.translations && recipe.translations[currentLang] && recipe.translations[currentLang].description
        ? recipe.translations[currentLang].description
        : recipe.description;

    return (
        <div className="recipe-card">
            <div className="recipe-image">
                <img src={recipe.image} alt={title} />
                <div className="recipe-overlay">
                    <span className="recipe-cuisine">{t(recipe.cuisine.toLowerCase()) || recipe.cuisine}</span>
                    <span className="recipe-difficulty">{t(recipe.difficulty.toLowerCase()) || recipe.difficulty}</span>
                </div>
            </div>
            <div className="recipe-content">
                <h3 className="recipe-title">{title}</h3>
                <p className="recipe-description">{description}</p>
                <div className="recipe-meta">
                    <span className="recipe-time">
                        ⏱️ {recipe.prepTime + recipe.cookTime} {t('min')}
                    </span>
                    <span className="recipe-servings">
                        👥 {recipe.servings} {t('servings')}
                    </span>
                </div>
                <div className="recipe-tags">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="recipe-tag">#{tag}</span>
                    ))}
                </div>
                <button onClick={handleViewRecipe} className="recipe-view-btn">
                    {t('view_recipe')}
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
