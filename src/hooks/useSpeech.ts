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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeSectionRef = useRef<string | null>(null);
  const isSpeakingRef = useRef(false);
  const isPausedRef = useRef(false);

  activeSectionRef.current = activeSection;
  isSpeakingRef.current = isSpeaking;
  isPausedRef.current = isPaused;

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
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((text: string, sectionId: string) => {
    if (!window.speechSynthesis) return;

    if (activeSectionRef.current === sectionId) {
      if (isPausedRef.current) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsSpeaking(true);
        return;
      }
      if (isSpeakingRef.current) {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsSpeaking(false);
        return;
      }
    }

    intentionalStopRef.current = true;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = getStoredSpeed();
    utterance.pitch = 1;
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((voice) => voice.lang.startsWith("en") && voice.localService);
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

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

    utterance.onerror = (event) => {
      if (!intentionalStopRef.current && event.error !== "interrupted") {
        clearState();
      }
    };

    utteranceRef.current = utterance;
    setActiveSection(sectionId);
    setIsSpeaking(true);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setCurrentWord(null);

    setTimeout(() => {
      intentionalStopRef.current = false;
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [clearState]);

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
