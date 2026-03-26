import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/VoiceAssistant.scss';
import { API_BASE } from '../config';

const CHATBOT_API = `${API_BASE}/api/chatbot`;

const getVoiceSessionId = () => {
  const existing = localStorage.getItem('voiceAssistantSessionId');
  if (existing) return existing;
  const created = `voice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem('voiceAssistantSessionId', created);
  return created;
};

const VoiceAssistant = ({ isVisible = true, onCommand, onReady, onListeningChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const clearTimerRef = useRef(null);
  const commandHandlerRef = useRef(null);
  const recognitionRef = useRef(null);
  const voicesRef = useRef([]);
  const sessionIdRef = useRef(getVoiceSessionId());
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognitionInstance = null;
    let mounted = true;

    const syncVoices = () => {
      if ('speechSynthesis' in window) {
        voicesRef.current = window.speechSynthesis.getVoices();
      }
    };

    syncVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = syncVoices;
    }

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionInstance = new SpeechRecognition();
      recognitionRef.current = recognitionInstance;

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.maxAlternatives = 1;
      recognitionInstance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onstart = () => {
        if (!mounted) return;
        setIsListening(true);
        setStatusMessage(t('voice_listening'));
        setTranscript('');
        setAssistantReply('');
        onListeningChange?.(true);
      };

      recognitionInstance.onend = () => {
        if (!mounted) return;
        setIsListening(false);
        setStatusMessage('');
        onListeningChange?.(false);
      };

      recognitionInstance.onresult = (event) => {
        if (!mounted) return;
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          setStatusMessage(t('voice_processing', { defaultValue: 'Processing...' }));
          commandHandlerRef.current?.(finalTranscript.toLowerCase().trim());
        }
      };

      recognitionInstance.onerror = (event) => {
        if (!mounted) return;
        setIsListening(false);
        const errorCode = event?.error || 'unknown';
        const messageMap = {
          'not-allowed': t('voice_mic_denied', { defaultValue: 'Microphone permission was denied.' }),
          'service-not-allowed': t('voice_mic_denied', { defaultValue: 'Microphone permission was denied.' }),
          'no-speech': t('voice_no_speech', { defaultValue: 'I did not hear anything. Please try again.' }),
          'audio-capture': t('voice_no_mic', { defaultValue: 'No microphone was detected.' }),
          'network': t('voice_network_error', { defaultValue: 'Voice recognition network error. Please try again.' }),
          'aborted': ''
        };
        setStatusMessage(messageMap[errorCode] || t('voice_error_generic', { defaultValue: 'Voice assistant ran into a problem.' }));
        onListeningChange?.(false);
      };
      onReady?.(recognitionInstance);
    } else {
      setIsSupported(false);
      setStatusMessage(t('voice_not_supported', { defaultValue: 'Voice assistant is not supported in this browser.' }));
    }

    return () => {
      mounted = false;
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      recognitionRef.current = null;
      onReady?.(null);
      onListeningChange?.(false);
    };
  }, [i18n.language, onListeningChange, onReady]);

  const queueClearBubbles = () => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }

    clearTimerRef.current = setTimeout(() => {
      setTranscript('');
      setAssistantReply('');
      setStatusMessage('');
    }, 7000);
  };

  const getSpeechLang = () => (i18n.language === 'hi' ? 'hi-IN' : 'en-US');

  const getPreferredVoice = () => {
    const preferredLang = getSpeechLang().toLowerCase();
    const baseLang = preferredLang.split('-')[0];
    const voices = voicesRef.current || [];

    return (
      voices.find((voice) => String(voice.lang || '').toLowerCase() === preferredLang) ||
      voices.find((voice) => String(voice.lang || '').toLowerCase().startsWith(baseLang)) ||
      voices.find((voice) => String(voice.name || '').toLowerCase().includes(baseLang)) ||
      null
    );
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLang();
      utterance.rate = i18n.language === 'hi' ? 0.88 : 0.92;
      utterance.pitch = 1;
      const voice = getPreferredVoice();
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const respond = (text) => {
    if (!text) return;
    setAssistantReply(text);
    setStatusMessage('');
    speakResponse(text);
    queueClearBubbles();
  };

  const sendToAI = async (command) => {
    try {
      setIsThinking(true);
      setStatusMessage(t('voice_processing', { defaultValue: 'Processing...' }));
      const token = localStorage.getItem('token');
      const response = await fetch(`${CHATBOT_API}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: command,
          sessionId: sessionIdRef.current
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Voice assistant could not reach the AI service');
      }

      respond(data.message || t('chatbot_error'));
    } catch (error) {
      console.error('Voice assistant AI error:', error);
      respond(t('chatbot_error'));
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceCommand = async (command) => {
    let handled = false;

    if (command.includes('go to') || command.includes('open') || command.includes('show')) {
      if (command.includes('home')) {
        navigate('/');
        respond('Opening home.');
        handled = true;
      } else if (command.includes('recipes') || command.includes('recipe')) {
        navigate('/recipes');
        respond('Opening recipes.');
        handled = true;
      } else if (command.includes('add recipe') || command.includes('create recipe')) {
        navigate('/add-recipe');
        respond('Opening add recipe.');
        handled = true;
      } else if (command.includes('planner') || command.includes('meal plan')) {
        navigate('/planner');
        respond('Opening planner.');
        handled = true;
      } else if (command.includes('collections') || command.includes('collection')) {
        navigate('/collections');
        respond('Opening collections.');
        handled = true;
      } else if (command.includes('dashboard') || command.includes('profile')) {
        navigate('/dashboard');
        respond('Opening dashboard.');
        handled = true;
      } else if (command.includes('settings')) {
        navigate('/settings');
        respond('Opening settings.');
        handled = true;
      } else if (command.includes('recommendations') || command.includes('ai') || command.includes('suggestions')) {
        navigate('/recommendations');
        respond('Opening AI recommendations.');
        handled = true;
      } else if (command.includes('collaborate') || command.includes('cook together') || command.includes('group cooking')) {
        navigate('/collaborate');
        respond('Opening collaboration.');
        handled = true;
      } else if (command.includes('nutrition') || command.includes('analytics') || command.includes('nutrients')) {
        navigate('/nutrition');
        respond('Opening nutrition analytics.');
        handled = true;
      }
    }
    else if (command.includes('search') || command.includes('find')) {
      const searchTerm = command.replace(/(search|find)/g, '').trim();
      if (searchTerm) {
        navigate(`/recipes?query=${encodeURIComponent(searchTerm)}`);
        respond(`Searching recipes for ${searchTerm}.`);
        handled = true;
      }
    }
    else if (command.includes('help') || command.includes('what can you do')) {
      respond(t('voice_help_text'));
      handled = true;
    }
    else if (onCommand) {
      handled = onCommand(command) !== false;
    }

    if (!handled) {
      await sendToAI(command);
    }
  };

  commandHandlerRef.current = handleVoiceCommand;

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (recognition && !isListening && !isThinking) {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setStatusMessage(t('voice_ready', { defaultValue: 'Listening started...' }));
        recognition.start();
      } catch (error) {
        setIsListening(false);
        setStatusMessage(t('voice_retry', { defaultValue: 'Voice assistant is getting ready. Please tap again.' }));
      }
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="voice-assistant">
      <button
        className={`voice-assistant-btn ${isListening ? 'listening' : ''} ${!isSupported ? 'is-disabled' : ''}`}
        onClick={isListening ? stopListening : startListening}
        title={isListening ? t('voice_stop_listening') : t('voice_start_assistant')}
        disabled={!isSupported}
      >
        <div className="voice-icon">
          {isListening ? (
            <div className="listening-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          )}
        </div>
      </button>

      {assistantReply && (
        <div className="voice-transcript voice-transcript--reply">
          <span className="transcript-label">AI</span>
          <span className="transcript-text">{assistantReply}</span>
        </div>
      )}

      {transcript && (
        <div className="voice-transcript">
          <span className="transcript-label">You</span>
          <span className="transcript-text">{transcript}</span>
        </div>
      )}

      {isListening && (
        <div className="voice-status">
          <span>{t('voice_listening')}</span>
        </div>
      )}

      {isThinking && (
        <div className="voice-status voice-status--thinking">
          <span>{t('voice_processing', { defaultValue: 'Processing...' })}</span>
        </div>
      )}

      {!isListening && statusMessage && (
        <div className="voice-status voice-status--info">
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
