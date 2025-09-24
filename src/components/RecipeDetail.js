import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RecipeDetail.scss';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReading, setIsReading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [waitingForContinue, setWaitingForContinue] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

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

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    useEffect(() => {
        if (timerActive && timerSeconds > 0) {
            const interval = setInterval(() => {
                setTimerSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setTimerActive(false);
                        setWaitingForContinue(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerInterval(interval);
            return () => clearInterval(interval);
        }
    }, [timerActive, timerSeconds]);

    const parseTimeFromText = (text) => {
        const timeRegex = /(\d+)\s*(minute|min|second|sec)s?/gi;
        const matches = text.match(timeRegex);
        if (matches) {
            let totalSeconds = 0;
            matches.forEach(match => {
                const num = parseInt(match.match(/\d+/)[0]);
                const unit = match.toLowerCase().includes('minute') || match.toLowerCase().includes('min') ? 60 : 1;
                totalSeconds += num * unit;
            });
            return totalSeconds;
        }
        return 0;
    };

    const skipTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        setTimerActive(false);
        setTimerSeconds(0);
        setWaitingForContinue(true);
    };

    const generateRecipeText = () => {
        if (!recipe) return '';

        // Only read recipe name, ingredients, and steps
        let text = `Recipe: ${recipe.title}. `;

        text += 'Ingredients: ';
        recipe.ingredients.forEach(ingredient => {
            text += `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}. `;
        });

        text += 'Instructions: ';
        recipe.instructions.forEach(instruction => {
            text += `Step ${instruction.step}: ${instruction.description}. `;
        });

        return text;
    };

    const startReading = () => {
        if (!speechSynthesis) {
            alert('Speech synthesis is not supported in your browser.');
            return;
        }

        if (waitingForContinue) {
            setWaitingForContinue(false);
            setIsReading(true);
            speakNextInstruction();
            return;
        }

        setCurrentStep(0);
        speakTitleAndIngredients();
    };

    const speakTitleAndIngredients = () => {
        if (!recipe) return;

        let text = `Recipe: ${recipe.title}. Ingredients: `;
        recipe.ingredients.forEach(ingredient => {
            text += `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}. `;
        });

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            setCurrentStep(0);
            speakNextInstruction();
        };
        utterance.onerror = () => {
            setIsReading(false);
            setWaitingForContinue(false);
        };

        speechSynthesis.speak(utterance);
        setIsReading(true);
    };

    const speakNextInstruction = () => {
        if (!recipe || currentStep >= recipe.instructions.length) {
            setIsReading(false);
            setWaitingForContinue(false);
            return;
        }

        const instruction = recipe.instructions[currentStep];
        const text = `Step ${instruction.step}: ${instruction.description}.`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            setIsReading(false);
            const time = parseTimeFromText(instruction.description);
            if (time > 0) {
                setTimerSeconds(time);
                setTimerActive(true);
            } else {
                setWaitingForContinue(true);
            }
            setCurrentStep(currentStep + 1);
        };
        utterance.onerror = () => {
            setIsReading(false);
            setWaitingForContinue(false);
        };

        speechSynthesis.speak(utterance);
        setIsReading(true);
    };

    const pauseReading = () => {
        if (speechSynthesis && isReading) {
            speechSynthesis.pause();
            setIsReading(false);
        }
    };

    const resumeReading = () => {
        if (speechSynthesis && speechSynthesis.paused) {
            speechSynthesis.resume();
            setIsReading(true);
        }
    };

    const stopReading = () => {
        if (speechSynthesis) {
            speechSynthesis.cancel();
            setIsReading(false);
        }
    };

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
                <div className="recipe-left-section">
                    <div className="recipe-image-large">
                        <img src={recipe.image} alt={recipe.title} />
                    </div>

                    <div className="recipe-info-section">
                        <h1>{recipe.title}</h1>
                        <p className="recipe-description">{recipe.description}</p>

                        <div className="reading-controls">
                            {!isReading && !speechSynthesis?.paused && !waitingForContinue && !timerActive && (
                                <button className="read-recipe-button" onClick={startReading}>
                                    Read Recipe Aloud
                                </button>
                            )}
                            {(isReading || speechSynthesis?.paused) && (
                                <>
                                    {isReading ? (
                                        <button className="read-recipe-button" onClick={pauseReading}>
                                            Pause
                                        </button>
                                    ) : (
                                        <button className="read-recipe-button" onClick={resumeReading}>
                                            Resume
                                        </button>
                                    )}
                                    <button className="read-recipe-button stop-button" onClick={stopReading}>
                                        Stop
                                    </button>
                                </>
                            )}
                            {waitingForContinue && (
                                <button className="read-recipe-button" onClick={startReading}>
                                    Next Step
                                </button>
                            )}
                            {timerActive && (
                                <div className="timer-display">
                                    <div className="timer-text">
                                        Timer: {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                                    </div>
                                    <button className="read-recipe-button skip-timer-button" onClick={skipTimer}>
                                        Skip Timer
                                    </button>
                                </div>
                            )}
                        </div>

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
                    </div>
                </div>

                <div className="recipe-right-section">
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
