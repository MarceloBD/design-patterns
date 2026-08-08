"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

export function useGameStore() {
  const [player, setPlayer] = useState<PlayerState>(loadPlayerState);
  const [isHydrated, setIsHydrated] = useState(false);
  const playerRef = useRef(player);
  playerRef.current = player;

  useEffect(() => {
    setPlayer(loadPlayerState());
    setIsHydrated(true);
  }, []);

  const persist = useCallback((newState: PlayerState) => {
    setPlayer(newState);
    playerRef.current = newState;
    savePlayerState(newState);
  }, []);

  const handleReadPattern = useCallback(
    (patternSlug: string): number => {
      if (player.readPatterns.includes(patternSlug)) {
        return 0;
      }
      let state = markPatternRead(player, patternSlug);
      state = addXp(state, XP_REWARDS.READ_PATTERN);
      state = updateStreak(state);
      persist(state);
      return XP_REWARDS.READ_PATTERN;
    },
    [player, persist]
  );

  const handleQuizComplete = useCallback(
    (result: QuizResult): { xpEarned: number; badgesEarned: string[]; leveledUp: boolean } => {
      const previousLevel = player.level;
      const badgesEarned: string[] = [];
      let xpEarned = 0;

      let state = saveQuizScore(player, result.patternSlug, result.percentage);

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
    [player, persist]
  );

  const handleSetName = useCallback(
    (name: string) => {
      persist(setPlayerName(player, name));
    },
    [player, persist]
  );

  const handleReset = useCallback(() => {
    resetPlayerState();
    setPlayer(loadPlayerState());
  }, []);

  const getStatus = useCallback(
    (patternSlug: string): PatternStatus => {
      return getPatternStatus(player, patternSlug);
    },
    [player]
  );

  const getProgress = useCallback(
    (category: PatternCategory) => {
      return getRealmProgress(player, category);
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
