import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/CollaborativeCooking.scss';

const CollaborativeCooking = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const messagesEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      joinSession(sessionId);
    } else {
      createNewSession();
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/collaboration/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId: 'sample-recipe-id', // In real app, this would come from props/params
          title: 'Sample Collaborative Cooking Session'
        })
      });

      if (response.ok) {
        const newSession = await response.json();
        setSession(newSession);
        setIsHost(true);
        navigate(`/collaborate/${newSession._id}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const joinSession = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/collaboration/sessions/${id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const sessionData = await response.json();
        setSession(sessionData.session);
        setParticipants(sessionData.participants);
        setMessages(sessionData.messages || []);
        setIsHost(sessionData.isHost);
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/collaboration/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: currentMessage,
          type: 'text'
        })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        setCurrentMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startTimer = (seconds) => {
    setTimer(seconds);
    setIsTimerActive(true);

    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          clearInterval(timerIntervalRef.current);
          // Notify all participants that timer is done
          sendSystemMessage('Timer finished! ⏰');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendSystemMessage = async (content) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/collaboration/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          type: 'system'
        })
      });
    } catch (error) {
      console.error('Error sending system message:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < (session?.recipe?.instructions?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
      sendSystemMessage(`Moving to step ${currentStep + 2}`);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      sendSystemMessage(`Going back to step ${currentStep}`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <div className="collaborative-loading">
        <div className="loading-spinner"></div>
        <p>Loading cooking session...</p>
      </div>
    );
  }

  return (
    <div className="collaborative-cooking">
      <div className="session-header">
        <div className="session-info">
          <h1>{session.title}</h1>
          <div className="session-meta">
            <span className="participants-count">
              <i className="fas fa-users"></i>
              {participants.length} cooking together
            </span>
            {isHost && <span className="host-badge">Host</span>}
          </div>
        </div>

        <div className="session-controls">
          <button
            className="share-btn"
            onClick={() => navigator.share?.({
              title: 'Join my cooking session!',
              text: 'Let\'s cook together!',
              url: window.location.href
            })}
          >
            <i className="fas fa-share"></i>
            Share Session
          </button>
        </div>
      </div>

      <div className="cooking-content">
        <div className="recipe-section">
          <div className="recipe-header">
            <h2>{session.recipe?.title}</h2>
            <div className="recipe-meta">
              <span>Step {currentStep + 1} of {session.recipe?.instructions?.length}</span>
              {isTimerActive && (
                <div className="timer-display">
                  <i className="fas fa-clock"></i>
                  {formatTime(timer)}
                </div>
              )}
            </div>
          </div>

          <div className="current-step">
            {session.recipe?.instructions?.[currentStep] && (
              <div className="step-content">
                <h3>Step {session.recipe.instructions[currentStep].step}</h3>
                <p>{session.recipe.instructions[currentStep].description}</p>

                {session.recipe.instructions[currentStep].description.toLowerCase().includes('minute') &&
                 session.recipe.instructions[currentStep].description.toLowerCase().includes('wait') && (
                  <button
                    className="timer-btn"
                    onClick={() => {
                      const timeMatch = session.recipe.instructions[currentStep].description.match(/(\d+)\s*minute/i);
                      if (timeMatch) {
                        startTimer(parseInt(timeMatch[1]) * 60);
                      }
                    }}
                  >
                    <i className="fas fa-play"></i>
                    Start Timer
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="step-navigation">
            <button
              className="nav-btn"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              <i className="fas fa-chevron-left"></i>
              Previous
            </button>

            <div className="step-indicators">
              {session.recipe?.instructions?.map((_, index) => (
                <div
                  key={index}
                  className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                />
              ))}
            </div>

            <button
              className="nav-btn"
              onClick={nextStep}
              disabled={currentStep >= (session.recipe?.instructions?.length || 0) - 1}
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-header">
            <h3>Cooking Chat</h3>
            <span className="online-count">{participants.length} online</span>
          </div>

          <div className="messages-container">
            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.type === 'system' ? 'system' : 'user'}`}
                >
                  {message.type !== 'system' && (
                    <div className="message-avatar">
                      {message.sender?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="message-content">
                    {message.type !== 'system' && (
                      <div className="message-sender">{message.sender?.name}</div>
                    )}
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="message-input">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} disabled={!currentMessage.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="participants-list">
        <h3>Participants</h3>
        <div className="participants">
          {participants.map((participant) => (
            <div key={participant._id} className="participant">
              <div className="participant-avatar">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="participant-info">
                <div className="participant-name">{participant.name}</div>
                <div className="participant-status">
                  {participant.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeCooking;