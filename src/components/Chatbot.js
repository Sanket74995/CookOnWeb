import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.scss';

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setError(null);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        // Add user message
        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/chatbot/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: inputValue })
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
        }

        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
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
                                            <li key={idx}>
                                                <strong>{recipe.title}</strong> - {recipe.cuisine} - {recipe.category}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
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
                        <button onClick={handleSendMessage} disabled={loading}>
                            {t('chatbot_send')}
                        </button>
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
