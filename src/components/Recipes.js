import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Recipes.scss';
import RecipeCard from './RecipeCard';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recipes');
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

    const handleRecipeClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

    if (loading) {
        return <div className="recipes-loading">Loading recipes...</div>;
    }

    return (
        <div className="recipes-container">
            <div className="recipes-header">
                <h1>All Recipes</h1>
                <p>Discover amazing recipes from around the world</p>
            </div>

            <div className="recipes-grid">
                {recipes.map(recipe => (
                    <div key={recipe._id} onClick={() => handleRecipeClick(recipe._id)}>
                        <RecipeCard recipe={recipe} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recipes;
