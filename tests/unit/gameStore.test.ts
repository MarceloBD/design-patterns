import { describe, it, expect, beforeEach } from "vitest";
import {
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
} from "@/stores/gameStore";
import { PlayerState } from "@/types/player";

function createDefaultPlayer(): PlayerState {
  return {
    playerName: "",
    currentXp: 0,
    level: 1,
    completedPatterns: [],
    quizScores: {},
    badges: [],
    currentStreak: 0,
    lastActiveDate: "",
    readPatterns: [],
    coins: 0,
    collectedCoins: [],
    inventory: [],
    activeEffects: [],
  };
}

describe("gameStore", () => {
  let player: PlayerState;

  beforeEach(() => {
    player = createDefaultPlayer();
  });

  describe("addXp", () => {
    it("adds XP to current total", () => {
      const result = addXp(player, 100);
      expect(result.currentXp).toBe(100);
    });

    it("levels up when threshold is reached", () => {
      const result = addXp(player, 200);
      expect(result.level).toBe(2);
    });

    it("jumps multiple levels when XP is large", () => {
      const result = addXp(player, 1000);
      expect(result.level).toBe(4);
    });
  });

  describe("markPatternRead", () => {
    it("adds pattern to readPatterns", () => {
      const result = markPatternRead(player, "factory-method");
      expect(result.readPatterns).toContain("factory-method");
    });

    it("does not duplicate existing reads", () => {
      player.readPatterns = ["factory-method"];
      const result = markPatternRead(player, "factory-method");
      expect(result.readPatterns).toHaveLength(1);
    });
  });

  describe("markPatternCompleted", () => {
    it("adds pattern to completedPatterns", () => {
      const result = markPatternCompleted(player, "builder");
      expect(result.completedPatterns).toContain("builder");
    });

    it("does not duplicate completed patterns", () => {
      player.completedPatterns = ["builder"];
      const result = markPatternCompleted(player, "builder");
      expect(result.completedPatterns).toHaveLength(1);
    });
  });

  describe("saveQuizScore", () => {
    it("stores score for pattern", () => {
      const result = saveQuizScore(player, "adapter", 80);
      expect(result.quizScores["adapter"]).toBe(80);
    });

    it("overwrites previous score", () => {
      player.quizScores = { adapter: 60 };
      const result = saveQuizScore(player, "adapter", 100);
      expect(result.quizScores["adapter"]).toBe(100);
    });
  });

  describe("addBadge", () => {
    it("adds badge to collection", () => {
      const result = addBadge(player, "perfect-score");
      expect(result.badges).toContain("perfect-score");
    });

    it("does not duplicate badges", () => {
      player.badges = ["perfect-score"];
      const result = addBadge(player, "perfect-score");
      expect(result.badges).toHaveLength(1);
    });
  });

  describe("updateStreak", () => {
    it("starts streak at 1 for first activity", () => {
      const result = updateStreak(player);
      expect(result.currentStreak).toBe(1);
    });

    it("increments streak for consecutive days", () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      player.lastActiveDate = yesterday;
      player.currentStreak = 5;
      const result = updateStreak(player);
      expect(result.currentStreak).toBe(6);
    });

    it("resets streak if day was missed", () => {
      const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split("T")[0];
      player.lastActiveDate = twoDaysAgo;
      player.currentStreak = 5;
      const result = updateStreak(player);
      expect(result.currentStreak).toBe(1);
    });

    it("does not change streak for same day", () => {
      const today = new Date().toISOString().split("T")[0];
      player.lastActiveDate = today;
      player.currentStreak = 3;
      const result = updateStreak(player);
      expect(result.currentStreak).toBe(3);
    });
  });

  describe("getPatternStatus", () => {
    it("returns completed for completed patterns", () => {
      player.completedPatterns = ["factory-method"];
      expect(getPatternStatus(player, "factory-method")).toBe("completed");
    });

    it("returns available for first pattern in realm", () => {
      expect(getPatternStatus(player, "factory-method")).toBe("available");
    });

    it("returns locked when prerequisites not met", () => {
      expect(getPatternStatus(player, "abstract-factory")).toBe("locked");
    });

    it("returns available when prerequisites are met", () => {
      player.completedPatterns = ["factory-method"];
      expect(getPatternStatus(player, "abstract-factory")).toBe("available");
    });
  });

  describe("getRealmProgress", () => {
    it("returns 0% for no completions", () => {
      const progress = getRealmProgress(player, "creational");
      expect(progress.percentage).toBe(0);
      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(5);
    });

    it("calculates correct percentage", () => {
      player.completedPatterns = ["factory-method", "abstract-factory"];
      const progress = getRealmProgress(player, "creational");
      expect(progress.percentage).toBe(40);
      expect(progress.completed).toBe(2);
    });
  });

  describe("isRealmComplete", () => {
    it("returns false when not all patterns completed", () => {
      expect(isRealmComplete(player, "creational")).toBe(false);
    });

    it("returns true when all patterns completed", () => {
      player.completedPatterns = ["factory-method", "abstract-factory", "builder", "prototype", "singleton"];
      expect(isRealmComplete(player, "creational")).toBe(true);
    });
  });

  describe("setPlayerName", () => {
    it("sets the player name", () => {
      const result = setPlayerName(player, "Hero");
      expect(result.playerName).toBe("Hero");
    });
  });
});
