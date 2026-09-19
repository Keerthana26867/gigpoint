import { useState, useEffect, useRef, useCallback } from 'react';
import { processVoiceCommand, mutateInventory } from '../services/api';

export const VOICE_STATES = {
  IDLE: 'IDLE',
  LISTENING: 'LISTENING',
  PROCESSING: 'PROCESSING',
  CONFIRMATION: 'CONFIRMATION',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export const useVoice = (onMutationSuccess) => {
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);
  const [transcript, setTranscript] = useState('');
  const [parsedIntent, setParsedIntent] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [language, setLanguage] = useState('en-IN'); // en-IN, hi-IN, te-IN
  const recognitionRef = useRef(null);

  // Text To Speech synthesis helper
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel(); // stop previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  // Setup Web Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setVoiceState(VOICE_STATES.LISTENING);
        setTranscript('');
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setVoiceState(VOICE_STATES.ERROR);
          setErrorMessage(`Microphone error: ${event.error}. You can also type your command below.`);
        }
      };

      recognition.onend = () => {
        // Handled in stopListening
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const startListening = useCallback(() => {
    setTranscript('');
    setParsedIntent(null);
    setConfirmationData(null);
    setQueryResult(null);
    setErrorMessage('');
    setSuccessMessage('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
      } catch (err) {
        // Already started or busy
        setVoiceState(VOICE_STATES.LISTENING);
      }
    } else {
      // Fallback if browser SpeechRecognition not supported
      setVoiceState(VOICE_STATES.LISTENING);
    }
  }, [language]);

  const stopListeningAndProcess = useCallback(async (manualText = null) => {
    const textToProcess = manualText !== null ? manualText : transcript;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore
      }
    }

    if (!textToProcess || !textToProcess.trim()) {
      setVoiceState(VOICE_STATES.ERROR);
      setErrorMessage("No speech was detected. Please tap the microphone and speak again.");
      return;
    }

    setVoiceState(VOICE_STATES.PROCESSING);

    try {
      const resp = await processVoiceCommand(textToProcess, language);

      if (!resp.success) {
        setVoiceState(VOICE_STATES.ERROR);
        setErrorMessage(resp.message || "Failed to understand request.");
        return;
      }

      const data = resp.data;
      setParsedIntent(data.parsedIntent);

      if (data.type === 'QUERY_RESPONSE') {
        setQueryResult(data.answer);
        setVoiceState(VOICE_STATES.SUCCESS);
        setSuccessMessage(data.answer);
        speakText(data.answer);
      } else if (data.type === 'CONFIRMATION_REQUIRED') {
        setConfirmationData(data.parsedIntent);
        setVoiceState(VOICE_STATES.CONFIRMATION);
      } else {
        setVoiceState(VOICE_STATES.ERROR);
        setErrorMessage(data.parsedIntent?.clarificationMessage || "Please clarify your request.");
      }
    } catch (err) {
      setVoiceState(VOICE_STATES.ERROR);
      setErrorMessage(err.response?.data?.message || err.message || "Network error. Please try again.");
    }
  }, [transcript, language, speakText]);

  const confirmMutation = useCallback(async (customPayload = null) => {
    const payload = customPayload || confirmationData;
    if (!payload || !payload.action || !payload.quantity) {
      setVoiceState(VOICE_STATES.ERROR);
      setErrorMessage("Invalid mutation parameters.");
      return;
    }

    setVoiceState(VOICE_STATES.PROCESSING);

    try {
      const resp = await mutateInventory({
        action: payload.action,
        productName: payload.product,
        productId: payload.matchedProductId,
        quantity: parseFloat(payload.quantity),
        unit: payload.unit,
        source: 'VOICE',
        transcript: payload.rawTranscript || transcript,
        requestId: `req-${Date.now()}`
      });

      if (resp.success) {
        setVoiceState(VOICE_STATES.SUCCESS);
        setSuccessMessage(resp.message);
        speakText(resp.message);
        if (onMutationSuccess) {
          onMutationSuccess(resp.data);
        }
      } else {
        setVoiceState(VOICE_STATES.ERROR);
        setErrorMessage(resp.message || resp.error?.message || "Stock mutation failed.");
      }
    } catch (err) {
      setVoiceState(VOICE_STATES.ERROR);
      const serverErr = err.response?.data?.message || err.response?.data?.error?.message || err.message;
      setErrorMessage(serverErr || "Failed to update inventory.");
    }
  }, [confirmationData, transcript, speakText, onMutationSuccess]);

  const resetVoice = useCallback(() => {
    setVoiceState(VOICE_STATES.IDLE);
    setTranscript('');
    setParsedIntent(null);
    setConfirmationData(null);
    setQueryResult(null);
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  return {
    voiceState,
    transcript,
    setTranscript,
    parsedIntent,
    confirmationData,
    setConfirmationData,
    queryResult,
    errorMessage,
    successMessage,
    language,
    setLanguage,
    startListening,
    stopListeningAndProcess,
    confirmMutation,
    resetVoice,
    speakText,
  };
};
