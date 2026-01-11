import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface Quote {
  text: string;
  author?: string;
}

export function useSpeakQuote(isPremium: boolean) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoiceName] = useLocalStorage<string>("zenvibe-selected-voice", "");
  const [voiceSpeed] = useLocalStorage<number>("zenvibe-voice-speed", 1);
  const [voicePitch] = useLocalStorage<number>("zenvibe-voice-pitch", 1);

  // Stop speaking on unmount (navigation)
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

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

    // Apply voice settings for premium users only
    if (isPremium && selectedVoiceName) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isPremium, selectedVoiceName, voiceSpeed, voicePitch, isSpeaking, stopSpeaking]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    if (isPremium && selectedVoiceName) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isPremium, selectedVoiceName, voiceSpeed, voicePitch, isSpeaking, stopSpeaking]);

  return { speakQuote, speakText, stopSpeaking, isSpeaking };
}