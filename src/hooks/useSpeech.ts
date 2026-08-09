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
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speed, setSpeedState] = useState(getStoredSpeed);
  const intentionalStopRef = useRef(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    localStorage.setItem(SPEED_STORAGE_KEY, String(newSpeed));
  }, []);

  const clearState = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWord(null);
    setCurrentWordIndex(-1);
    setActiveSection(null);
  }, []);

  const speak = useCallback((text: string, sectionId: string) => {
    if (!window.speechSynthesis) return;

    if (activeSection === sectionId) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsSpeaking(true);
        return;
      }
      if (isSpeaking) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsSpeaking(false);
        return;
      }
    }

    intentionalStopRef.current = true;
    window.speechSynthesis.cancel();
    intentionalStopRef.current = false;

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
      if (!intentionalStopRef.current) {
        clearState();
      }
    };

    utterance.onerror = () => {
      if (!intentionalStopRef.current) {
        clearState();
      }
    };

    setActiveSection(sectionId);
    setIsSpeaking(true);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setCurrentWord(null);
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, isPaused, activeSection, clearState]);

  const stop = useCallback(() => {
    intentionalStopRef.current = true;
    window.speechSynthesis?.cancel();
    intentionalStopRef.current = false;
    clearState();
  }, [clearState]);

  return {
    speak,
    stop,
    isSpeaking,
    isPaused,
    currentWord,
    currentWordIndex,
    activeSection,
    speed,
    setSpeed,
  };
}
