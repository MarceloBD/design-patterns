"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const SPEED_STORAGE_KEY = "tts-speed";

function getStoredSpeed(): number {
  if (typeof window === "undefined") return 1;
  const stored = localStorage.getItem(SPEED_STORAGE_KEY);
  return stored ? parseFloat(stored) : 1;
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speed, setSpeedState] = useState(getStoredSpeed);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    localStorage.setItem(SPEED_STORAGE_KEY, String(newSpeed));
  }, []);

  const speak = useCallback((text: string, sectionId: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (activeSection === sectionId && isSpeaking) {
      setIsSpeaking(false);
      setCurrentWord(null);
      setCurrentWordIndex(-1);
      setActiveSection(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = getStoredSpeed();
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        setCurrentWord(word);
        const wordsBeforeCursor = text.substring(0, event.charIndex).split(/\s+/).filter(Boolean).length;
        setCurrentWordIndex(wordsBeforeCursor);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWord(null);
      setCurrentWordIndex(-1);
      setActiveSection(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentWord(null);
      setCurrentWordIndex(-1);
      setActiveSection(null);
    };

    utteranceRef.current = utterance;
    setActiveSection(sectionId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, activeSection]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentWord(null);
    setCurrentWordIndex(-1);
    setActiveSection(null);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    currentWord,
    currentWordIndex,
    activeSection,
    speed,
    setSpeed,
  };
}
