"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const SPEED_STORAGE_KEY = "tts-speed";
const VOICE_STORAGE_KEY = "tts-voice";

function getStoredSpeed(): number {
  if (typeof window === "undefined") return 1;
  const stored = localStorage.getItem(SPEED_STORAGE_KEY);
  return stored ? parseFloat(stored) : 1;
}

function getStoredVoiceName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(VOICE_STORAGE_KEY) ?? "";
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [speed, setSpeedState] = useState(getStoredSpeed);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(getStoredVoiceName);
  const intentionalStopRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeSectionRef = useRef<string | null>(null);
  const isSpeakingRef = useRef(false);
  const isPausedRef = useRef(false);

  activeSectionRef.current = activeSection;
  isSpeakingRef.current = isSpeaking;
  isPausedRef.current = isPaused;

  useEffect(() => {
    function loadVoices() {
      const available = window.speechSynthesis?.getVoices() ?? [];
      const englishVoices = available.filter((v) => v.lang.startsWith("en"));
      setVoices(englishVoices.length > 0 ? englishVoices : available);
    }
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    localStorage.setItem(SPEED_STORAGE_KEY, String(newSpeed));
  }, []);

  const setVoice = useCallback((voiceName: string) => {
    setSelectedVoiceName(voiceName);
    localStorage.setItem(VOICE_STORAGE_KEY, voiceName);
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

    const availableVoices = window.speechSynthesis.getVoices();
    const storedName = getStoredVoiceName();
    const selectedVoice = storedName
      ? availableVoices.find((v) => v.name === storedName)
      : availableVoices.find((v) => v.lang.startsWith("en") && v.localService);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
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
    voices,
    selectedVoiceName,
    setVoice,
  };
}
