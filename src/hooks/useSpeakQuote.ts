import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface Quote {
  text: string;
  author?: string;
}

// Get filtered English voices
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
}

// Get default English voice
export function getDefaultEnglishVoice(): SpeechSynthesisVoice | null {
  const englishVoices = getEnglishVoices();
  if (englishVoices.length === 0) return null;
  
  // Prefer default English voice, then US English, then first English
  return (
    englishVoices.find(v => v.default) ||
    englishVoices.find(v => v.lang === 'en-US') ||
    englishVoices[0]
  );
}

export function useSpeakQuote(isPremium: boolean) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoiceName] = useLocalStorage<string>("zenvibe-selected-voice", "");
  const [voiceSpeed] = useLocalStorage<number>("zenvibe-voice-speed", 1);
  const [voicePitch] = useLocalStorage<number>("zenvibe-voice-pitch", 1);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load English voices
  useEffect(() => {
    const loadVoices = () => {
      setEnglishVoices(getEnglishVoices());
    };
    
    loadVoices();
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop speaking on unmount (navigation)
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Get the voice to use based on premium status
  const activeVoice = useMemo(() => {
    if (englishVoices.length === 0) return null;
    
    if (isPremium && selectedVoiceName) {
      // Premium users can use their selected voice
      const selected = englishVoices.find(v => v.name === selectedVoiceName);
      if (selected) return selected;
    }
    
    // Free users or fallback: use default English voice
    return getDefaultEnglishVoice();
  }, [isPremium, selectedVoiceName, englishVoices]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakQuote = useCallback((quote: Quote) => {
    if (!('speechSynthesis' in window)) return;

    // If already speaking, stop
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const text = quote.author 
      ? `${quote.text}. By ${quote.author}` 
      : quote.text;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Always set English language
    utterance.lang = activeVoice?.lang || 'en-US';
    
    // Always set voice explicitly
    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    // Apply speed/pitch for premium users
    if (isPremium) {
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isPremium, activeVoice, voiceSpeed, voicePitch, isSpeaking, stopSpeaking]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Always set English language
    utterance.lang = activeVoice?.lang || 'en-US';
    
    // Always set voice explicitly
    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    // Apply speed/pitch for premium users
    if (isPremium) {
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isPremium, activeVoice, voiceSpeed, voicePitch, isSpeaking, stopSpeaking]);

  return { speakQuote, speakText, stopSpeaking, isSpeaking, englishVoices, activeVoice };
}