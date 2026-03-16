import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.scss';

const commonQueries = [
    'Gym breakfast ideas',
    'Diabetic-friendly Indian dinner',
    'Vegetarian high-protein meals',
    'Kids lunchbox recipes',
    'Quick recipes with paneer',
    'Create my meal plan for this week',
    'Make my shopping list',
    'Generate recipe with paneer, onion, tomato',
    'Scale paneer curry to 4 servings'
];

const getSessionId = () => {
    const existing = localStorage.getItem('chatbotSessionId');
    if (existing) return existing;
    const created = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('chatbotSessionId', created);
    return created;
};

const formatGoalLabel = (value) => String(value || '').replace(/-/g, ' ');

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const sessionIdRef = useRef(getSessionId());

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                text: t('chatbot_initial_message'),
                sender: 'bot'
            }]);
        }
    }, [isOpen, messages.length, t]);

    const sendFeedback = async ({ logId, helpful, clickedRecipeId }) => {
        if (!logId) return;

        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/chatbot/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ logId, helpful, clickedRecipeId })
            });
        } catch (feedbackError) {
            console.error('Feedback error:', feedbackError);
        }
    };

    const handleSendMessage = async (messageText) => {
        const textToSend = messageText !== undefined ? messageText : inputValue;
        if (textToSend.trim() === '') return;

        setMessages((prev) => [...prev, { text: textToSend, sender: 'user' }]);
        setLoading(true);
        setError(null);
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/chatbot/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    message: textToSend,
                    sessionId: sessionIdRef.current
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from chatbot API');
            }

            const data = await response.json();
            const botMessage = {
                text: data.message,
                sender: 'bot',
                recipes: data.recipes || [],
                shoppingList: data.shoppingList || [],
                generatedRecipe: data.generatedRecipe || null,
                mealPlan: data.mealPlan || null,
                scalePreview: data.scalePreview || null,
                queryType: data.queryType,
                logId: data.logId,
                learnedFrom: data.learnedFrom || null,
                feedbackGiven: false
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            setError(`Error: ${err.message}`);
            setMessages((prev) => [...prev, {
                text: t('chatbot_error'),
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
            setIsTyping(false);
            setInputValue('');
        }
    };

    const handleFeedbackClick = async (index, helpful) => {
        const message = messages[index];
        if (!message?.logId || message.feedbackGiven) return;

        await sendFeedback({ logId: message.logId, helpful });
        setMessages((prev) => prev.map((item, itemIndex) =>
            itemIndex === index ? { ...item, feedbackGiven: true, helpful } : item
        ));
    };

    const handleRecipeClick = async (message, recipeId) => {
        await sendFeedback({ logId: message.logId, clickedRecipeId: recipeId, helpful: true });
        const isLoggedIn = localStorage.getItem('token') !== null;
        window.location.href = isLoggedIn ? `/recipe/${recipeId}` : '/login';
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>{t('chatbot_title') || 'Recipe Chatbot'}</h3>
                        <button className="close-btn" onClick={() => { setIsOpen(false); setError(null); }}>&times;</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                {message.sender === 'bot' && message.queryType && (
                                    <span className="query-type-badge">
                                        {message.queryType === 'ingredients' && t('query_type_ingredient')}
                                        {message.queryType === 'dietary' && t('query_type_dietary')}
                                        {message.queryType === 'cuisine' && t('query_type_cuisine')}
                                        {message.queryType === 'category' && t('query_type_category')}
                                        {message.queryType === 'specific_recipe' && t('query_type_specific_recipe')}
                                        {message.queryType === 'preference' && t('query_type_preference')}
                                        {message.queryType === 'conversation' && t('query_type_conversation')}
                                        {message.queryType === 'random' && t('query_type_random')}
                                        {message.queryType === 'shopping_list' && t('query_type_shopping_list')}
                                        {message.queryType === 'meal_plan' && t('query_type_meal_plan')}
                                        {message.queryType === 'scale_recipe' && t('query_type_scale_recipe')}
                                        {message.queryType === 'generate_recipe' && t('query_type_generate_recipe')}
                                    </span>
                                )}

                                <p>{message.text}</p>

                                {message.learnedFrom && (message.learnedFrom.foodProfileGoal || message.learnedFrom.topTags?.length > 0) && (
                                    <div className="chatbot-learning-note">
                                        {t('learned_from')} {' '}
                                        {message.learnedFrom.foodProfileGoal
                                            ? message.learnedFrom.source === 'query'
                                                ? `${t('learned_from_request')} (${formatGoalLabel(message.learnedFrom.foodProfileGoal)})`
                                                : `${t('learned_from_food_plan')} (${formatGoalLabel(message.learnedFrom.foodProfileGoal)})`
                                            : `${t('learned_from_past_likes')} (${message.learnedFrom.topTags.join(', ')})`}
                                    </div>
                                )}

                                {message.recipes && message.recipes.length > 0 && (
                                    <ul className="recipe-list">
                                        {message.recipes.map((recipe, idx) => (
                                            <li
                                                key={idx}
                                                className="clickable-recipe"
                                                onClick={() => handleRecipeClick(message, recipe._id)}
                                            >
                                                <strong>{recipe.title}</strong> - {recipe.cuisine} ({recipe.category})
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {message.generatedRecipe && (
                                    <div className="chatbot-learning-note">
                                        <strong>{message.generatedRecipe.title}</strong>
                                        <br />
                                        {message.generatedRecipe.description}
                                    </div>
                                )}

                                {message.scalePreview && (
                                    <div className="chatbot-learning-note">
                                        <strong>{message.scalePreview.title}</strong>
                                        <br />
                                        {message.scalePreview.baseServings} to {message.scalePreview.targetServings} servings
                                        <ul className="recipe-list">
                                            {message.scalePreview.ingredients.slice(0, 6).map((ingredient, ingredientIndex) => (
                                                <li key={ingredientIndex}>
                                                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {message.shoppingList && message.shoppingList.length > 0 && (
                                    <div className="chatbot-learning-note">
                                        <strong>Shopping List</strong>
                                        <ul className="recipe-list">
                                            {message.shoppingList.slice(0, 10).map((item, itemIndex) => (
                                                <li key={itemIndex}>
                                                    {item.name} - {item.quantity}{item.unit ? ` ${item.unit}` : ''}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {message.mealPlan?.entries?.length > 0 && (
                                    <div className="chatbot-learning-note">
                                        <strong>Planned week</strong>
                                        <ul className="recipe-list">
                                            {message.mealPlan.entries.slice(0, 7).map((entry, entryIndex) => (
                                                <li key={entryIndex}>
                                                    {entry.date} - {entry.mealType}: {entry.recipe?.title || 'Recipe'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {message.sender === 'bot' && message.logId && (
                                    <div className="chatbot-feedback">
                                        <button
                                            type="button"
                                            disabled={message.feedbackGiven}
                                            onClick={() => handleFeedbackClick(index, true)}
                                        >
                                            Helpful
                                        </button>
                                        <button
                                            type="button"
                                            disabled={message.feedbackGiven}
                                            onClick={() => handleFeedbackClick(index, false)}
                                        >
                                            Not helpful
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="typing-indicator" aria-label="Chatbot is typing">
                                <span />
                                <span />
                                <span />
                            </div>
                        )}
                        {loading && <div className="message bot">Loading recipes...</div>}
                        {error && <div className="message error">{error}</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                            placeholder="Ask about recipes or ingredients..."
                            disabled={loading}
                        />
                        <button onClick={() => handleSendMessage()} disabled={loading}>
                            {t('chatbot_send') || 'Send'}
                        </button>
                    </div>

                    <h5>Suggestions</h5>
                    <div className="quick-queries">
                        {commonQueries.map((query, idx) => (
                            <button key={idx} className="quick-query-btn" onClick={() => handleSendMessage(query)}>
                                {query}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="button"
                className="chatbot-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
            >
                <span className="chat-icon">Chat</span>
            </button>
        </div>
    );
};

export default Chatbot;
