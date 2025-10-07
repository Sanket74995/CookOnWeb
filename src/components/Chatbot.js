import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.scss';

const commonQueries = [
    "Chicken recipes",
    "Italian food",
    "Vegetarian recipes",
    "Desserts",
    "Quick snacks"
];

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Show welcome message on open
            const welcomeMessage = { text: t('chatbot_welcome'), sender: 'bot' };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, t]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setError(null);
        if (!isOpen) {
            setMessages([]);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: textToSend })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from chatbot API');
            }

            const data = await response.json();

            // Add bot response message
            const botMessage = { text: data.message, sender: 'bot', recipes: data.recipes || [] };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            setError('Error: ' + err.message);
            const errorMessage = { text: 'Sorry, something went wrong. Please try again later.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setIsTyping(false);
        }

        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleQuickQueryClick = (query) => {
        handleSendMessage(query);
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>{t('chatbot_title')}</h3>
                        <button className="close-btn" onClick={toggleChat}>
                            &times;
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                {message.text}
                                {message.recipes && message.recipes.length > 0 && (
                                    <ul className="recipe-list">
                                        {message.recipes.map((recipe, idx) => (
                                            <li key={idx} className="clickable-recipe" onClick={() => {
                                                // Check if user is logged in
                                                const isLoggedIn = localStorage.getItem('token') !== null;
                                                if (isLoggedIn) {
                                                    window.location.href = `/recipe/${recipe._id}`;
                                                } else {
                                                    // Redirect to login or register page
                                                    window.location.href = '/login';
                                                }
                                            }}>
                                                <strong>{recipe.title}</strong> - {recipe.cuisine} - {recipe.category}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                        {isTyping && <div className="message bot typing-indicator">Typing...</div>}
                        {loading && <div className="message bot">Loading...</div>}
                        {error && <div className="message error">{error}</div>}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder={t('chatbot_placeholder')}
                            disabled={loading}
                        />
                        <button onClick={() => handleSendMessage()} disabled={loading}>
                            {t('chatbot_send')}
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
