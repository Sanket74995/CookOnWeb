import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/VoiceAssistant.scss';

const VoiceAssistant = ({ isVisible = true, onCommand, onReady, onListeningChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognitionInstance = null;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
        onListeningChange?.(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognitionInstance.onresult = (event) => {
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
          handleVoiceCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };

      setRecognition(recognitionInstance);
      onReady?.(recognitionInstance);
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      onReady?.(null);
      onListeningChange?.(false);
    };
  }, [i18n.language, onListeningChange, onReady]);

  const handleVoiceCommand = (command) => {
    // Process voice commands from speech recognition

    // Navigation commands
    if (command.includes('go to') || command.includes('open') || command.includes('show')) {
      if (command.includes('home')) {
        navigate('/');
      } else if (command.includes('recipes') || command.includes('recipe')) {
        navigate('/recipes');
      } else if (command.includes('add recipe') || command.includes('create recipe')) {
        navigate('/add-recipe');
      } else if (command.includes('planner') || command.includes('meal plan')) {
        navigate('/planner');
      } else if (command.includes('collections') || command.includes('collection')) {
        navigate('/collections');
      } else if (command.includes('dashboard') || command.includes('profile')) {
        navigate('/dashboard');
      } else if (command.includes('settings')) {
        navigate('/settings');
      } else if (command.includes('recommendations') || command.includes('ai') || command.includes('suggestions')) {
        navigate('/recommendations');
      } else if (command.includes('collaborate') || command.includes('cook together') || command.includes('group cooking')) {
        navigate('/collaborate');
      } else if (command.includes('nutrition') || command.includes('analytics') || command.includes('nutrients')) {
        navigate('/nutrition');
      }
    }

    // Search commands
    else if (command.includes('search') || command.includes('find')) {
      const searchTerm = command.replace(/(search|find)/g, '').trim();
      if (searchTerm) {
        navigate(`/recipes?query=${encodeURIComponent(searchTerm)}`);
      }
    }

    // Recipe-specific commands (pass to parent component)
    else if (onCommand) {
      onCommand(command);
    }

    // General commands
    else if (command.includes('help') || command.includes('what can you do')) {
      speakResponse(t('voice_help_text'));
    }

    // Clear transcript after processing
    setTimeout(() => setTranscript(''), 2000);
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported || !isVisible) return null;

  return (
    <div className="voice-assistant">
      <button
        className={`voice-assistant-btn ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
        title={isListening ? t('voice_stop_listening') : t('voice_start_assistant')}
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

      {transcript && (
        <div className="voice-transcript">
          <span className="transcript-text">{transcript}</span>
        </div>
      )}

      {isListening && (
        <div className="voice-status">
          <span>{t('voice_listening')}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
