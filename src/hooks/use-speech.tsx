import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SpeechContextType {
  isEnabled: boolean;
  isSpeaking: boolean;
  toggle: () => void;
  speak: (text: string) => void;
  stop: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('agromie-speech-enabled');
    return saved === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('agromie-speech-enabled', String(isEnabled));
  }, [isEnabled]);

  const toggle = () => {
    if (isEnabled) {
      window.speechSynthesis.cancel();
    }
    setIsEnabled(!isEnabled);
  };

  const speak = (text: string) => {
    if (!isEnabled || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <SpeechContext.Provider value={{ isEnabled, isSpeaking, toggle, speak, stop }}>
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
}
