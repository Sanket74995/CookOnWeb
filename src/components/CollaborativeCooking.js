import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/CollaborativeCooking.scss';
import Loader from './Loader';
import { API_BASE } from '../config';

const COLLABORATION_API = `${API_BASE}/api/collaboration`;
const RECIPES_API = `${API_BASE}/api/recipes`;
const QUICK_MESSAGES = [
  'I am chopping vegetables.',
  'Starting the next step now.',
  'Can someone handle plating?',
  'Timer done. Ready for the next move.',
];

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
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [showSetup, setShowSetup] = useState(!sessionId);
  const [setupForm, setSetupForm] = useState({
    title: '',
    recipeId: ''
  });
  const [recipeSearch, setRecipeSearch] = useState('');
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [copyState, setCopyState] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (sessionId) {
      joinSession(sessionId);
    } else {
      setLoading(false);
      setShowSetup(true);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!session?._id) return undefined;

    pollIntervalRef.current = setInterval(() => {
      refreshSession(session._id);
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [session?._id]);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(RECIPES_API, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (response.ok) {
        setAvailableRecipes(Array.isArray(data) ? data : (data.recipes || []));
      }
    } catch (error) {
      console.error('Error fetching recipes for collaboration:', error);
    }
  };

  const hydrateSession = (payload) => {
    if (!payload) return;
    if (payload.session) {
      setSession(payload.session);
      setParticipants(payload.participants || []);
      setMessages(payload.messages || []);
      setIsHost(Boolean(payload.isHost));
      return;
    }

    setSession({
      _id: payload._id,
      title: payload.title,
      recipe: payload.recipe
    });
    setParticipants(payload.participants || []);
    setMessages(payload.messages || []);
    setIsHost(Boolean(payload.isHost));
  };

  const refreshSession = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${COLLABORATION_API}/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) return;

      const payload = await response.json();
      hydrateSession(payload);
    } catch (error) {
      console.error('Error refreshing collaboration session:', error);
    }
  };

  const createNewSession = async () => {
    setCreating(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${COLLABORATION_API}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: setupForm.title.trim(),
          recipeId: setupForm.recipeId || undefined
        })
      });

      const newSession = await response.json();
      if (!response.ok) {
        throw new Error(newSession.message || 'Unable to create session');
      }

      hydrateSession(newSession);
      setShowSetup(false);
      navigate(`/collaborate/${newSession._id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      setErrorMessage(error.message || 'Unable to create session.');
    } finally {
      setCreating(false);
    }
  };

  const joinSession = async (id) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${COLLABORATION_API}/sessions/${id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const sessionData = await response.json();
      if (!response.ok) {
        throw new Error(sessionData.message || 'Unable to join session');
      }

      hydrateSession(sessionData);
      setShowSetup(false);
    } catch (error) {
      console.error('Error joining session:', error);
      setErrorMessage(error.message || 'Unable to join session.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content = currentMessage) => {
    if (!content.trim() || !session?._id) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${COLLABORATION_API}/sessions/${session._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim(),
          type: 'text'
        })
      });

      const newMessage = await response.json();
      if (!response.ok) {
        throw new Error(newMessage.message || 'Unable to send message');
      }

      setMessages((prev) => [...prev, newMessage]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage(error.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  const startTimer = (seconds) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setTimer(seconds);
    setIsTimerActive(true);

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          clearInterval(timerIntervalRef.current);
          sendMessage('Timer finished. Ready for the next step.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < (session?.recipe?.instructions?.length || 0) - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      sendMessage(`Moving to step ${nextIndex + 1}.`);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const nextIndex = currentStep - 1;
      setCurrentStep(nextIndex);
      sendMessage(`Going back to step ${nextIndex + 1}.`);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('Invite link copied.');
    } catch (error) {
      setCopyState('Unable to copy invite link.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: session?.title || t('join_my_cooking_session'),
        text: t('lets_cook_together'),
        url: window.location.href
      });
      return;
    }

    handleCopyInvite();
  };

  const filteredRecipes = useMemo(() => {
    return availableRecipes.filter((recipe) => {
      const haystack = `${recipe.title} ${recipe.cuisine} ${recipe.category}`.toLowerCase();
      return haystack.includes(recipeSearch.trim().toLowerCase());
    });
  }, [availableRecipes, recipeSearch]);

  const currentInstruction = session?.recipe?.instructions?.[currentStep];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loader label={t('loading_cooking_session')} variant="page" />;
  }

  if (showSetup) {
    return (
      <div className="collaborative-cooking">
        <section className="session-setup">
          <div className="setup-copy">
            <p className="setup-eyebrow">Collaborate Live</p>
            <h1>Start a shared cooking room</h1>
            <p>Choose a recipe, name the session, and invite others to cook step-by-step with you.</p>
          </div>

          {errorMessage && <div className="session-alert">{errorMessage}</div>}

          <div className="setup-grid">
            <div className="setup-panel">
              <label>Session title</label>
              <input
                type="text"
                value={setupForm.title}
                onChange={(e) => setSetupForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Saturday prep party"
              />

              <label>Search recipe</label>
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search by recipe name or cuisine"
              />

              <div className="recipe-picker">
                {filteredRecipes.slice(0, 10).map((recipe) => (
                  <button
                    key={recipe._id}
                    type="button"
                    className={`recipe-pick ${setupForm.recipeId === recipe._id ? 'active' : ''}`}
                    onClick={() => setSetupForm((prev) => ({
                      ...prev,
                      recipeId: recipe._id,
                      title: prev.title || `${recipe.title} Session`
                    }))}
                  >
                    <strong>{recipe.title}</strong>
                    <span>{recipe.cuisine} · {recipe.category}</span>
                  </button>
                ))}
              </div>

              <div className="setup-actions">
                <button
                  className="primary-btn"
                  type="button"
                  onClick={createNewSession}
                  disabled={creating || !setupForm.recipeId}
                >
                  {creating ? 'Creating...' : 'Create Session'}
                </button>
              </div>
            </div>

            <div className="setup-preview">
              <h3>What you get</h3>
              <ul>
                <li>Shared step tracker for the selected recipe</li>
                <li>Invite link you can copy or share instantly</li>
                <li>Live participant list and cooking chat</li>
                <li>Quick timers and short coordination messages</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!session) {
    return <div className="collaborative-cooking"><div className="session-alert">Unable to load the cooking session.</div></div>;
  }

  return (
    <div className="collaborative-cooking">
      <div className="session-header">
        <div className="session-info">
          <p className="setup-eyebrow">Collaboration Room</p>
          <h1>{session.title}</h1>
          <div className="session-meta">
            <span className="participants-count">{participants.length} cooking together</span>
            {isHost && <span className="host-badge">{t('host')}</span>}
            {session.recipe?.title && <span className="recipe-badge">{session.recipe.title}</span>}
          </div>
        </div>

        <div className="session-controls">
          <button className="secondary-btn" onClick={handleCopyInvite}>Copy Invite</button>
          <button className="share-btn" onClick={handleShare}>{t('share_session')}</button>
        </div>
      </div>

      {copyState && <div className="session-alert">{copyState}</div>}
      {errorMessage && <div className="session-alert">{errorMessage}</div>}

      <div className="cooking-content">
        <div className="recipe-section">
          <div className="recipe-header">
            <div>
              <h2>{session.recipe?.title || 'Recipe session'}</h2>
              <div className="recipe-meta">
                <span>{t('step_of_total', { current: currentStep + 1, total: session.recipe?.instructions?.length || 0 })}</span>
                {isTimerActive && <div className="timer-display">{formatTime(timer)}</div>}
              </div>
            </div>
            <div className="timer-actions">
              <button type="button" className="timer-chip" onClick={() => startTimer(300)}>5 min</button>
              <button type="button" className="timer-chip" onClick={() => startTimer(600)}>10 min</button>
              <button type="button" className="timer-chip" onClick={() => startTimer(900)}>15 min</button>
            </div>
          </div>

          <div className="current-step">
            {currentInstruction ? (
              <div className="step-content">
                <h3>{t('step_number', { number: currentInstruction.step })}</h3>
                <p>{currentInstruction.description}</p>
              </div>
            ) : (
              <div className="step-content">
                <h3>No recipe step selected</h3>
                <p>Choose a recipe when creating the session to unlock shared step tracking.</p>
              </div>
            )}
          </div>

          <div className="step-navigation">
            <button className="nav-btn" onClick={previousStep} disabled={currentStep === 0}>
              {t('previous')}
            </button>

            <div className="step-indicators">
              {session.recipe?.instructions?.map((instruction, index) => (
                <button
                  key={instruction.step || index}
                  type="button"
                  className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(index)}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="nav-btn"
              onClick={nextStep}
              disabled={currentStep >= (session.recipe?.instructions?.length || 0) - 1}
            >
              {t('next')}
            </button>
          </div>

          <div className="steps-overview">
            <h3>Step Overview</h3>
            <div className="step-list">
              {(session.recipe?.instructions || []).map((instruction, index) => (
                <button
                  key={instruction.step || index}
                  type="button"
                  className={`step-row ${index === currentStep ? 'active' : ''}`}
                  onClick={() => setCurrentStep(index)}
                >
                  <span>Step {instruction.step}</span>
                  <strong>{instruction.description}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-header">
            <h3>{t('cooking_chat')}</h3>
            <span className="online-count">{participants.length} {t('online')}</span>
          </div>

          <div className="quick-messages">
            {QUICK_MESSAGES.map((message) => (
              <button key={message} type="button" onClick={() => sendMessage(message)}>
                {message}
              </button>
            ))}
          </div>

          <div className="messages-container">
            <div className="messages">
              {messages.map((message) => (
                <div key={message._id || `${message.timestamp}-${message.content}`} className={`message ${message.type === 'system' ? 'system' : 'user'}`}>
                  {message.type !== 'system' && (
                    <div className="message-avatar">
                      {(message.sender?.name || message.senderName || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="message-content">
                    {message.type !== 'system' && (
                      <div className="message-sender">{message.sender?.name || message.senderName || 'Cook'}</div>
                    )}
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
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
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('type_a_message')}
            />
            <button onClick={() => sendMessage()} disabled={!currentMessage.trim() || sending}>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="participants-list">
        <h3>{t('participants')}</h3>
        <div className="participants">
          {participants.map((participant) => (
            <div key={participant._id} className="participant">
              <div className="participant-avatar">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="participant-info">
                <div className="participant-name">{participant.name}</div>
                <div className="participant-status">
                  {participant.isOnline ? t('online') : t('offline')}
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
