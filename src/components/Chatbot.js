import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.scss';

const Chatbot = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Add user message
        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(inputValue);
            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        }, 1000);

        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const generateBotResponse = (userInput) => {
        const input = userInput.toLowerCase();

        // Simple response logic - in a real app, this would connect to a recipe API
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            return t('chatbot_welcome');
        } else if (input.includes('recipe') || input.includes('dish') || input.includes('food')) {
            return t('chatbot_recipe_suggestion');
        } else if (input.includes('ingredient') || input.includes('ingredients')) {
            return t('chatbot_ingredient_help');
        } else if (input.includes('chicken') || input.includes('paneer') || input.includes('vegetable')) {
            return t('chatbot_specific_recipe');
        } else {
            return t('chatbot_default_response');
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
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder={t('chatbot_placeholder')}
                        />
                        <button onClick={handleSendMessage}>
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
