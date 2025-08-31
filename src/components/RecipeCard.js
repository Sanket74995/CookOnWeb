import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecipeCard.scss';

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();

    const handleViewRecipe = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/recipes');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="recipe-card">
            <div className="recipe-image">
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-overlay">
                    <span className="recipe-cuisine">{recipe.cuisine}</span>
                    <span className="recipe-difficulty">{recipe.difficulty}</span>
                </div>
            </div>
            <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-meta">
                    <span className="recipe-time">
                        ⏱️ {recipe.prepTime + recipe.cookTime} min
                    </span>
                    <span className="recipe-servings">
                        👥 {recipe.servings} servings
                    </span>
                </div>
                <div className="recipe-tags">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="recipe-tag">#{tag}</span>
                    ))}
                </div>
                <button onClick={handleViewRecipe} className="recipe-view-btn">
                    View Recipe
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
