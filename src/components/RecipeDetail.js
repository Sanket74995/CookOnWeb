import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RecipeDetail.scss';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecipe(data);
                    console.log('Recipe video URL:', data.video);
                } else {
                    console.error('Failed to fetch recipe');
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) {
        return <div className="recipe-detail-loading">Loading recipe...</div>;
    }

    if (!recipe) {
        return <div className="recipe-detail-error">Recipe not found</div>;
    }

    return (
        <div className="recipe-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back to Recipes
            </button>

            <div className="recipe-detail">
                <div className="recipe-image-large">
                    <img src={recipe.image} alt={recipe.title} />
                </div>

                {recipe.video && (
                    <div className="recipe-video-section">
                        <h2>Video Tutorial</h2>
                        <div className="video-container">
                            <iframe
                                width="100%"
                                height="400"
                                src={recipe.video.startsWith('https://www.youtube.com/embed/') ? recipe.video : `https://www.youtube.com/embed/${recipe.video}`}
                                title={`${recipe.title} video tutorial`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay; encrypted-media"
                                allowFullScreen
                            >
                                Sorry, your browser does not support embedded videos.
                            </iframe>
                        </div>
                    </div>
                )}

                <div className="recipe-info">
                    <h1>{recipe.title}</h1>
                    <p className="recipe-description">{recipe.description}</p>

                    <div className="recipe-meta-detail">
                        <div className="meta-item">
                            <span className="meta-label">Cuisine:</span>
                            <span className="meta-value">{recipe.cuisine}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">{recipe.category}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Difficulty:</span>
                            <span className="meta-value">{recipe.difficulty}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Prep Time:</span>
                            <span className="meta-value">{recipe.prepTime} min</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Cook Time:</span>
                            <span className="meta-value">{recipe.cookTime} min</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Servings:</span>
                            <span className="meta-value">{recipe.servings}</span>
                        </div>
                    </div>

                    <div className="ingredients-section">
                        <h2>Ingredients</h2>
                        <ul className="ingredients-list">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    <span className="ingredient-quantity">
                                        {ingredient.quantity} {ingredient.unit}
                                    </span>
                                    <span className="ingredient-name">{ingredient.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="instructions-section">
                        <h2>Instructions</h2>
                        <ol className="instructions-list">
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index}>
                                    <span className="instruction-step">{instruction.step}.</span>
                                    <span className="instruction-description">{instruction.description}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="nutrition-section">
                        <h2>Nutrition Information</h2>
                        <div className="nutrition-grid">
                            <div className="nutrition-item">
                                <span className="nutrition-label">Calories:</span>
                                <span className="nutrition-value">{recipe.nutrition.calories}</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="nutrition-label">Protein:</span>
                                <span className="nutrition-value">{recipe.nutrition.protein}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="nutrition-label">Carbs:</span>
                                <span className="nutrition-value">{recipe.nutrition.carbs}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="nutrition-label">Fat:</span>
                                <span className="nutrition-value">{recipe.nutrition.fat}g</span>
                            </div>
                        </div>
                    </div>

                    <div className="tags-section">
                        <h2>Tags</h2>
                        <div className="tags-list">
                            {recipe.tags.map((tag, index) => (
                                <span key={index} className="recipe-tag">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
