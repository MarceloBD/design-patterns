"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { PlayerState } from "@/types/player";
import { PatternCategory, PatternStatus } from "@/types/pattern";
import { QuizResult } from "@/types/quiz";
import { XP_REWARDS } from "@/data/levels";
import {
  loadPlayerState,
  savePlayerState,
  addXp,
  markPatternRead,
  markPatternCompleted,
  saveQuizScore,
  addBadge,
  updateStreak,
  getPatternStatus,
  getRealmProgress,
  isRealmComplete,
  setPlayerName,
  resetPlayerState,
  collectCoin,
} from "@/stores/gameStore";

type Listener = () => void;

const listeners = new Set<Listener>();
let globalPlayer: PlayerState = loadPlayerState();
let hydrated = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): PlayerState {
  return globalPlayer;
}

function getServerSnapshot(): PlayerState {
  return loadPlayerState();
}

function persistGlobal(newState: PlayerState) {
  globalPlayer = newState;
  savePlayerState(newState);
  emitChange();
}

export function useGameStore() {
  const player = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isHydrated, setIsHydrated] = useState(hydrated);
  const playerRef = useRef(player);
  playerRef.current = player;

  useEffect(() => {
    if (!hydrated) {
      globalPlayer = loadPlayerState();
      hydrated = true;
      emitChange();
    }
    setIsHydrated(true);
  }, []);

  const persist = useCallback((newState: PlayerState) => {
    persistGlobal(newState);
  }, []);

  const handleReadPattern = useCallback(
    (patternSlug: string): number => {
      const current = playerRef.current;
      if (current.readPatterns.includes(patternSlug)) {
        return 0;
      }
      let state = markPatternRead(current, patternSlug);
      state = addXp(state, XP_REWARDS.READ_PATTERN);
      state = updateStreak(state);
      persist(state);
      return XP_REWARDS.READ_PATTERN;
    },
    [persist]
  );

  const handleQuizComplete = useCallback(
    (result: QuizResult): { xpEarned: number; badgesEarned: string[]; leveledUp: boolean } => {
      const current = playerRef.current;
      const previousLevel = current.level;
      const badgesEarned: string[] = [];
      let xpEarned = 0;

      let state = saveQuizScore(current, result.patternSlug, result.percentage);

      if (result.passed) {
        xpEarned += XP_REWARDS.QUIZ_PASS;
        state = addXp(state, XP_REWARDS.QUIZ_PASS);
        state = markPatternCompleted(state, result.patternSlug);

        const patternBadge = result.patternSlug;
        state = addBadge(state, patternBadge);
        badgesEarned.push(patternBadge);

        if (result.percentage === 100) {
          xpEarned += XP_REWARDS.QUIZ_PERFECT;
          state = addXp(state, XP_REWARDS.QUIZ_PERFECT);
          if (!state.badges.includes("perfect-score")) {
            state = addBadge(state, "perfect-score");
            badgesEarned.push("perfect-score");
          }
        }

        if (result.timeSpent < 30) {
          if (!state.badges.includes("speed-runner")) {
            state = addBadge(state, "speed-runner");
            badgesEarned.push("speed-runner");
          }
        }

        const categories: PatternCategory[] = ["creational", "structural", "behavioral"];
        for (const category of categories) {
          if (isRealmComplete(state, category) && !state.badges.includes(`realm-${category}`)) {
            xpEarned += XP_REWARDS.REALM_COMPLETE;
            state = addXp(state, XP_REWARDS.REALM_COMPLETE);
            state = addBadge(state, `realm-${category}`);
            badgesEarned.push(`realm-${category}`);
          }
        }

        if (state.completedPatterns.length === 22 && !state.badges.includes("completionist")) {
          state = addBadge(state, "completionist");
          badgesEarned.push("completionist");
        }
      }

      state = updateStreak(state);
      persist(state);

      return {
        xpEarned,
        badgesEarned,
        leveledUp: state.level > previousLevel,
      };
    },
    [persist]
  );

  const handleSetName = useCallback(
    (name: string) => {
      persist(setPlayerName(playerRef.current, name));
    },
    [persist]
  );

  const handleReset = useCallback(() => {
    resetPlayerState();
    globalPlayer = loadPlayerState();
    hydrated = true;
    emitChange();
  }, []);

  const getStatus = useCallback(
    (patternSlug: string): PatternStatus => {
      return getPatternStatus(playerRef.current, patternSlug);
    },
    [player]
  );

  const getProgress = useCallback(
    (category: PatternCategory) => {
      return getRealmProgress(playerRef.current, category);
    },
    [player]
  );

  const updatePlayer = useCallback(
    (newState: PlayerState) => {
      persist(newState);
    },
    [persist]
  );

  const handleCollectCoin = useCallback(
    (coinId: string) => {
      const current = playerRef.current;
      if (current.collectedCoins?.includes(coinId)) return;
      persist(collectCoin(current, coinId));
    },
    [persist]
  );

  return {
    player,
    isHydrated,
    handleReadPattern,
    handleQuizComplete,
    handleSetName,
    handleReset,
    getStatus,
    getProgress,
    updatePlayer,
    handleCollectCoin,
  };
}
