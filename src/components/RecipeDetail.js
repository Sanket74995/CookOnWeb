import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/RecipeDetail.scss';
import VoiceAssistant from './VoiceAssistant';
import Loader from './Loader';

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
    const [desiredServings, setDesiredServings] = useState(1);
    const [voiceAssistant, setVoiceAssistant] = useState(null);
    const [voiceListening, setVoiceListening] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecipe(data);
                    setDesiredServings(Number(data.servings || 1));
                } else {
                    setRecipe(null);
                }
            } catch (error) {
                setRecipe(null);
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

    // Enhanced voice command handler
    const handleVoiceCommand = (command) => {
        // Received a recipe voice command for navigation and controls

        // Reading controls
        if (command.includes('start') || command.includes('begin') || command.includes('read')) {
            startReading();
        } else if (command.includes('pause') || command.includes('stop reading')) {
            pauseReading();
        } else if (command.includes('resume') || command.includes('continue')) {
            resumeReading();
        } else if (command.includes('stop') || command.includes('end')) {
            stopReading();
        } else if (command.includes('repeat') || command.includes('again')) {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
            setWaitingForContinue(false);
            setTimeout(() => startReading(), 100);
        } else if (command.includes('next step') || command.includes('next')) {
            if (waitingForContinue) {
                setWaitingForContinue(false);
                speakNextInstruction();
            }
        } else if (command.includes('previous') || command.includes('back')) {
            setCurrentStep((prev) => Math.max(prev - 2, 0));
            setWaitingForContinue(false);
            setTimeout(() => startReading(), 100);
        }

        // Timer controls
        else if (command.includes('skip timer') || command.includes('skip')) {
            skipTimer();
        }

        // Servings adjustment
        else if (command.includes('servings') || command.includes('serves')) {
            const match = command.match(/(\d+)\s*(servings?|serves?)/i);
            if (match) {
                const newServings = parseInt(match[1], 10);
                if (newServings > 0 && newServings <= 20) {
                    setDesiredServings(newServings);
                }
            }
        }

        // Recipe information
        else if (command.includes('ingredients') || command.includes('what do i need')) {
            speakIngredients();
        } else if (command.includes('nutrition') || command.includes('nutrients')) {
            speakNutrition();
        } else if (command.includes('time') || command.includes('how long')) {
            speakTimeInfo();
        }

        // Navigation
        else if (command.includes('edit') || command.includes('modify')) {
            navigate(`/recipe/${id}/edit`);
        } else if (command.includes('back') || command.includes('return')) {
            navigate(-1);
        }
    };

    const speakIngredients = () => {
        if (!speechSynthesis || !recipe) return;

        let text = 'Ingredients needed: ';
        ingredients.forEach((ingredient, index) => {
            const scaledQty = formatScaledQuantity(ingredient.quantity);
            text += `${scaledQty || ''} ${ingredient.unit || ''} ${ingredient.name}`;
            if (index < ingredients.length - 1) text += ', ';
        });

        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const speakNutrition = () => {
        if (!speechSynthesis || !recipe) return;

        const nutrition = recipe.nutrition || {};
        let text = 'Nutrition information per serving: ';
        if (nutrition.calories) text += `${nutrition.calories} calories, `;
        if (nutrition.protein) text += `${nutrition.protein} grams protein, `;
        if (nutrition.carbs) text += `${nutrition.carbs} grams carbs, `;
        if (nutrition.fat) text += `${nutrition.fat} grams fat.`;

        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const speakTimeInfo = () => {
        if (!speechSynthesis || !recipe) return;

        const prepTime = Number(recipe.prepTime || 0);
        const cookTime = Number(recipe.cookTime || 0);
        const totalTime = prepTime + cookTime;

        let text = `Preparation time: ${prepTime} minutes. Cooking time: ${cookTime} minutes. Total time: ${totalTime} minutes.`;

        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

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
        return <Loader label="Loading recipe..." variant="page" />;
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
    const servingScale = servings > 0 ? desiredServings / servings : 1;

    const parseQuantity = (value) => {
        const text = String(value || '').trim();
        if (!text) return null;

        if (/^\d+\/\d+$/.test(text)) {
            const [numerator, denominator] = text.split('/').map(Number);
            return denominator ? numerator / denominator : null;
        }

        if (/^\d+\s+\d+\/\d+$/.test(text)) {
            const [whole, fraction] = text.split(/\s+/);
            const [numerator, denominator] = fraction.split('/').map(Number);
            return denominator ? Number(whole) + numerator / denominator : null;
        }

        const numeric = Number(text.replace(/[^0-9.]/g, ''));
        return Number.isFinite(numeric) ? numeric : null;
    };

    const formatScaledQuantity = (value) => {
        const parsed = parseQuantity(value);
        if (parsed == null) return value;
        const scaled = Math.round(parsed * servingScale * 100) / 100;
        return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    };

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

    const toggleVoiceAssistant = () => {
        if (!voiceAssistant) {
            alert('Voice recognition is not supported in your browser.');
            return;
        }

        if (voiceListening) {
            voiceAssistant.stop();
        } else {
            voiceAssistant.start();
        }
    };

    const shareOnSocial = (platform, title, url) => {
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const copyToClipboard = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
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
                            <button className="read-recipe-button" type="button" onClick={toggleVoiceAssistant}>
                                {voiceListening ? 'Stop Voice Assistant' : 'Voice Assistant'}
                            </button>
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

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label htmlFor="desiredServings">Scale recipe servings</label>
                            <input
                                id="desiredServings"
                                type="number"
                                min="1"
                                value={desiredServings}
                                onChange={(e) => setDesiredServings(Number(e.target.value) || 1)}
                            />
                        </div>

                        <div className="ingredients-section">
                            <h2>{i18n.t('ingredients')}</h2>
                            <ul className="ingredients-list">
                                {ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        <span className="ingredient-quantity">
                                            {formatScaledQuantity(ingredient.quantity) || ''} {ingredient.unit || ''}
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

                    <div className="share-section">
                        <h2>Share this Recipe</h2>
                        <div className="share-buttons">
                            <button
                                className="share-btn facebook"
                                onClick={() => shareOnSocial('facebook', recipe.title, window.location.href)}
                            >
                                Facebook
                            </button>
                            <button
                                className="share-btn twitter"
                                onClick={() => shareOnSocial('twitter', recipe.title, window.location.href)}
                            >
                                Twitter
                            </button>
                            <button
                                className="share-btn whatsapp"
                                onClick={() => shareOnSocial('whatsapp', recipe.title, window.location.href)}
                            >
                                WhatsApp
                            </button>
                            <button
                                className="share-btn copy-link"
                                onClick={() => copyToClipboard(window.location.href)}
                            >
                                Copy Link
                            </button>
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
            <VoiceAssistant onCommand={handleVoiceCommand} />
        </div>
    );
};

export default RecipeDetail;
