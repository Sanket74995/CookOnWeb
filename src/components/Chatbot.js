import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.scss';

const commonQueries = [
    "Recipes with chicken, tomato and garlic",
    "Italian pasta dishes",
    "Vegetarian dinner ideas",
    "Desserts with chocolate",
    "Quick snacks using bread"
];

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);


    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Show welcome message when opened
            const welcomeMessage = {
                text: "👋 Hi! I’m your recipe assistant. Ask me something like ‘recipes with egg and cheese’ or ‘Italian dishes’.",
                sender: 'bot'
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setError(null);
        //if (!isOpen) setMessages([]);
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleSendMessage = async (messageText) => {
        const textToSend = messageText !== undefined ? messageText : inputValue;
        if (textToSend.trim() === '') return;

        // Add user message
        const userMessage = { text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/chatbot/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: textToSend })
            });

            if (!response.ok) throw new Error('Failed to get response from chatbot API');

            const data = await response.json();

            // Add bot message
            const botMessage = {
                text: data.message,
                sender: 'bot',
                recipes: data.recipes || [],
                queryType: data.queryType
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            setError('Error: ' + err.message);
            setMessages(prev => [...prev, { text: 'Sorry, something went wrong. Please try again later.', sender: 'bot' }]);
        } finally {
            setLoading(false);
            setIsTyping(false);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const handleQuickQueryClick = (query) => handleSendMessage(query);

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>{t('chatbot_title') || 'Recipe Chatbot'}</h3>
                        <button className="close-btn" onClick={toggleChat}>&times;</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                {message.sender === 'bot' && message.queryType && (
                                    <span className="query-type-badge">
                                        {message.queryType === 'ingredients' && '🔍 Ingredient-based'}
                                        {message.queryType === 'dietary' && '🥗 Dietary preference'}
                                        {message.queryType === 'cuisine' && '🍽 Cuisine'}
                                        {message.queryType === 'category' && '🕒 Meal type'}
                                        {message.queryType === 'specific_recipe' && '📌 Specific dish'}
                                        {message.queryType === 'random' && '🎲 Suggestions'}
                                    </span>
                                )}

                                <p>{message.text}</p>

                                {message.recipes && message.recipes.length > 0 && (
                                    <ul className="recipe-list">
                                        {message.recipes.map((recipe, idx) => (
                                            <li
                                                key={idx}
                                                className="clickable-recipe"
                                                onClick={() => {
                                                    const isLoggedIn = localStorage.getItem('token') !== null;
                                                    window.location.href = isLoggedIn ? `/recipe/${recipe._id}` : '/login';
                                                }}
                                            >
                                                <strong>{recipe.title}</strong> — {recipe.cuisine} ({recipe.category})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}



                        {isTyping && <div className="message bot typing-indicator">Typing...</div>}
                        {loading && <div className="message bot">Loading recipes...</div>}
                        {error && <div className="message error">{error}</div>}

                        {/* 👇 Always keep this at the end */}
                        <div ref={messagesEndRef} />
                    </div>


                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
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
                            <button key={idx} className="quick-query-btn" onClick={() => handleQuickQueryClick(query)}>
                                {query}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button className="chatbot-toggle" onClick={toggleChat}>
                <span className="chat-icon">💬</span>
            </button>
        </div>
    );
};

export default Chatbot;
