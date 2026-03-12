import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/RecipeDetail.scss';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReading, setIsReading] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [waitingForContinue, setWaitingForContinue] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
    const [savingReview, setSavingReview] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecipe(data);
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
                setTimerSeconds((prev) => {
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

    if (loading) {
        return <div className="recipe-detail-loading">Loading recipe...</div>;
    }

    if (!recipe) {
        return <div className="recipe-detail-error">Recipe not found</div>;
    }

    const localizedTitle = currentLang !== 'en' && recipe.translations && recipe.translations[currentLang] && recipe.translations[currentLang].title
        ? recipe.translations[currentLang].title
        : recipe.title;

    const localizedDescription = currentLang !== 'en' && recipe.translations && recipe.translations[currentLang] && recipe.translations[currentLang].description
        ? recipe.translations[currentLang].description
        : recipe.description;

    const localizedIngredients = currentLang !== 'en' && recipe.translations && recipe.translations[currentLang] && recipe.translations[currentLang].ingredients
        ? recipe.translations[currentLang].ingredients
        : recipe.ingredients;

    const localizedInstructions = currentLang !== 'en' && recipe.translations && recipe.translations[currentLang] && recipe.translations[currentLang].instructions
        ? recipe.translations[currentLang].instructions
        : recipe.instructions;

    const ingredients = Array.isArray(localizedIngredients) ? localizedIngredients : [];
    const instructions = Array.isArray(localizedInstructions) ? localizedInstructions : [];
    const nutrition = recipe.nutrition || {};
    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
    const reviews = Array.isArray(recipe.reviews) ? recipe.reviews : [];
    const difficulty = recipe.difficulty || 'medium';
    const prepTime = Number(recipe.prepTime || 0);
    const cookTime = Number(recipe.cookTime || 0);
    const servings = Number(recipe.servings || 0);
    const averageRating = recipe.rating?.average || 0;
    const reviewCount = recipe.rating?.count || reviews.length;

    const parseTimeFromText = (text) => {
        const timeRegex = /(\d+)\s*(minute|min|second|sec)s?/gi;
        const matches = text.match(timeRegex);
        if (matches) {
            let totalSeconds = 0;
            matches.forEach((match) => {
                const num = parseInt(match.match(/\d+/)[0], 10);
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

    const speakNextInstruction = () => {
        if (!recipe || currentStep >= instructions.length) {
            setIsReading(false);
            setWaitingForContinue(false);
            return;
        }

        const instruction = instructions[currentStep];
        const utterance = new SpeechSynthesisUtterance(`Step ${instruction.step}: ${instruction.description}.`);

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

    const speakTitleAndIngredients = () => {
        if (!recipe) return;

        let text = `Recipe: ${localizedTitle}. Ingredients: `;
        ingredients.forEach((ingredient) => {
            text += `${ingredient.quantity || ''} ${ingredient.unit || ''} ${ingredient.name}. `;
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
            setWaitingForContinue(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setSavingReview(true);
            const response = await fetch(`http://localhost:5000/api/recipes/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewForm),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to save review');
            }
            setRecipe(data.recipe);
            setReviewForm({ rating: '5', comment: '' });
        } catch (error) {
            console.error('Review save failed:', error);
            alert(error.message || 'Unable to save review');
        } finally {
            setSavingReview(false);
        }
    };

    return (
        <div className="recipe-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                Back to Recipes
            </button>

            <div className="recipe-detail">
                <div className="recipe-left-section">
                    <div className="recipe-image-large">
                        <img src={recipe.image} alt={localizedTitle} />
                    </div>

                    <div className="recipe-info-section">
                        <h1>{localizedTitle}</h1>
                        <p className="recipe-description">{localizedDescription}</p>

                        <div className="recipe-rating-summary">
                            <strong>{averageRating.toFixed(1)} / 5</strong>
                            <span>{reviewCount} reviews</span>
                        </div>

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
                                <span className="meta-label">{i18n.t('cuisine')}:</span>
                                <span className="meta-value">{i18n.t(recipe.cuisine.toLowerCase()) || recipe.cuisine}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{i18n.t('category')}:</span>
                                <span className="meta-value">{i18n.t(recipe.category.toLowerCase()) || recipe.category}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{i18n.t('difficulty')}:</span>
                                <span className="meta-value">{i18n.t(difficulty.toLowerCase()) || difficulty}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{i18n.t('prep_time')}:</span>
                                <span className="meta-value">{prepTime} {i18n.t('minutes') || 'min'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{i18n.t('cook_time')}:</span>
                                <span className="meta-value">{cookTime} {i18n.t('minutes') || 'min'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{i18n.t('servings')}:</span>
                                <span className="meta-value">{servings}</span>
                            </div>
                        </div>

                        <div className="ingredients-section">
                            <h2>{i18n.t('ingredients')}</h2>
                            <ul className="ingredients-list">
                                {ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        <span className="ingredient-quantity">
                                            {ingredient.quantity || ''} {ingredient.unit || ''}
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
                            <div className="video-container">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={recipe.video.startsWith('https://www.youtube.com/embed/') ? recipe.video : `https://www.youtube.com/embed/${recipe.video}`}
                                    title={`${localizedTitle} video tutorial`}
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
                        <h2>{i18n.t('instructions')}</h2>
                        <ol className="instructions-list">
                            {instructions.map((instruction, index) => (
                                <li key={index}>
                                    <span className="instruction-step">{instruction.step}.</span>
                                    <span className="instruction-description">{instruction.description}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="nutrition-section">
                        <h2>{i18n.t('nutrition_information')}</h2>
                        <div className="nutrition-grid">
                            <div className="nutrition-item">
                                <span className="nutrition-label">{i18n.t('calories')}:</span>
                                <span className="nutrition-value">{nutrition.calories ?? '-'}</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="nutrition-label">{i18n.t('protein')}:</span>
                                <span className="nutrition-value">{nutrition.protein ?? '-'}{nutrition.protein != null ? 'g' : ''}</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="nutrition-label">{i18n.t('carbs')}:</span>
                                <span className="nutrition-value">{nutrition.carbs ?? '-'}{nutrition.carbs != null ? 'g' : ''}</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="nutrition-label">{i18n.t('fat')}:</span>
                                <span className="nutrition-value">{nutrition.fat ?? '-'}{nutrition.fat != null ? 'g' : ''}</span>
                            </div>
                        </div>
                    </div>

                    <div className="tags-section">
                        <h2>{i18n.t('tags')}</h2>
                        <div className="tags-list">
                            {tags.map((tag, index) => (
                                <span key={index} className="recipe-tag">#{i18n.t(tag.toLowerCase()) || tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="reviews-section">
                        <div className="reviews-section__header">
                            <h2>Ratings & Reviews</h2>
                            <span>{averageRating.toFixed(1)} average</span>
                        </div>

                        <form className="review-form" onSubmit={submitReview}>
                            <div className="review-form__row">
                                <select
                                    value={reviewForm.rating}
                                    onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: e.target.value }))}
                                >
                                    {[5, 4, 3, 2, 1].map((value) => (
                                        <option key={value} value={value}>
                                            {value} stars
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className="read-recipe-button" disabled={savingReview}>
                                    {savingReview ? 'Saving...' : 'Submit review'}
                                </button>
                            </div>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                                placeholder="Share what worked well or what could improve."
                            />
                        </form>

                        <div className="review-list">
                            {reviews.length === 0 ? (
                                <p>No reviews yet. Be the first to rate this recipe.</p>
                            ) : (
                                reviews.map((review) => (
                                    <article key={review._id} className="review-card">
                                        <div className="review-card__header">
                                            <strong>{review.name}</strong>
                                            <span>{review.rating}/5</span>
                                        </div>
                                        <p>{review.comment || 'Left a rating without a comment.'}</p>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
