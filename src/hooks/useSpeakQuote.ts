import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface Quote {
  text: string;
  author?: string;
}

type LangCode = "en" | "zh";

// Get voices filtered by language
export function getVoicesForLanguage(lang: LangCode): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  const prefix = lang === 'zh' ? 'zh' : 'en';
  return speechSynthesis.getVoices().filter(v => v.lang.startsWith(prefix));
}

// Get default voice for a language
export function getDefaultVoiceForLanguage(lang: LangCode): SpeechSynthesisVoice | null {
  const voices = getVoicesForLanguage(lang);
  if (voices.length === 0) return null;
  const defaultLang = lang === 'zh' ? 'zh-CN' : 'en-US';
  return (
    voices.find(v => v.default) ||
    voices.find(v => v.lang === defaultLang) ||
    voices[0]
  );
}

// Legacy exports for backward compat
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  return getVoicesForLanguage('en');
}

export function getDefaultEnglishVoice(): SpeechSynthesisVoice | null {
  return getDefaultVoiceForLanguage('en');
}

export function useSpeakQuote(isPremium: boolean) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoiceName] = useLocalStorage<string>("zenvibe-selected-voice", "");
  const [voiceSpeed] = useLocalStorage<number>("zenvibe-voice-speed", 1);
  const [voicePitch] = useLocalStorage<number>("zenvibe-voice-pitch", 1);
  const [currentLang] = useLocalStorage<LangCode>("zenvibe-language", "en");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(getVoicesForLanguage(currentLang));
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = null;
    };
  }, [currentLang]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    };
  }, []);

  const activeVoice = useMemo(() => {
    if (voices.length === 0) return null;
    if (isPremium && selectedVoiceName) {
      const selected = voices.find(v => v.name === selectedVoiceName);
      if (selected) return selected;
    }
    return getDefaultVoiceForLanguage(currentLang);
  }, [isPremium, selectedVoiceName, voices, currentLang]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakQuote = useCallback((quote: Quote) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) { stopSpeaking(); return; }

    const text = quote.author 
      ? `${quote.text}. By ${quote.author}` 
      : quote.text;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeVoice?.lang || (currentLang === 'zh' ? 'zh-CN' : 'en-US');
    if (activeVoice) utterance.voice = activeVoice;
    if (isPremium) {
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  }, [isPremium, activeVoice, voiceSpeed, voicePitch, isSpeaking, stopSpeaking, currentLang]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) { stopSpeaking(); return; }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeVoice?.lang || (currentLang === 'zh' ? 'zh-CN' : 'en-US');
    if (activeVoice) utterance.voice = activeVoice;
    if (isPremium) {
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  }, [isPremium, activeVoice, voiceSpeed, voicePitch, isSpeaking, stopSpeaking, currentLang]);

  return { speakQuote, speakText, stopSpeaking, isSpeaking, englishVoices: voices, activeVoice };
}
