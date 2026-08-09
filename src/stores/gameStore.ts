import { PlayerState } from "@/types/player";
import { getLevelForXp } from "@/data/levels";
import { PATTERN_METADATA, getPatternsByCategory } from "@/data/patterns";
import { PatternStatus, PatternCategory } from "@/types/pattern";
import { saveIntegrity, verifyIntegrity, validateState } from "@/lib/state-integrity";

const STORAGE_KEY = "design-patterns-player";

const DEFAULT_PLAYER: PlayerState = {
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

export function loadPlayerState(): PlayerState {
  if (typeof window === "undefined") {
    return DEFAULT_PLAYER;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PLAYER;
    }
    const parsed = JSON.parse(stored);
    const merged: PlayerState = { ...DEFAULT_PLAYER, ...parsed };

    if (!verifyIntegrity(merged)) {
      const validated = validateState(merged);
      savePlayerState(validated);
      return validated;
    }

    return validateState(merged);
  } catch {
    return DEFAULT_PLAYER;
  }
}

export function savePlayerState(state: PlayerState): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveIntegrity(state);
}

export function resetPlayerState(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

export function exportProgress(): string {
  const state = loadPlayerState();
  const exportData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  return JSON.stringify(exportData);
}

export async function exportProgressEncrypted(): Promise<string> {
  const { encryptSaveData } = await import("@/lib/save-encryption");
  const plaintext = exportProgress();
  return encryptSaveData(plaintext);
}

export async function importProgressEncrypted(encryptedData: string): Promise<{ success: boolean; error?: string }> {
  const { decryptSaveData, isEncryptedFormat, isLegacyJsonFormat } = await import("@/lib/save-encryption");

  try {
    let jsonString: string;

    if (isEncryptedFormat(encryptedData)) {
      try {
        jsonString = await decryptSaveData(encryptedData);
      } catch {
        return { success: false, error: "Decryption failed. This save may be from another device or corrupted." };
      }
    } else if (isLegacyJsonFormat(encryptedData)) {
      jsonString = encryptedData;
    } else {
      return { success: false, error: "Unrecognized save format" };
    }

    return importProgress(jsonString);
  } catch {
    return { success: false, error: "Failed to process save data" };
  }
}

export function importProgress(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.version || !parsed.data) {
      return { success: false, error: "Invalid file format" };
    }
    const state: PlayerState = { ...DEFAULT_PLAYER, ...parsed.data };
    const validated = validateState(state);
    savePlayerState(validated);
    return { success: true };
  } catch {
    return { success: false, error: "Could not parse file" };
  }
}

export function addXp(state: PlayerState, xp: number): PlayerState {
  const newXp = state.currentXp + xp;
  const newLevel = getLevelForXp(newXp);
  return {
    ...state,
    currentXp: newXp,
    level: newLevel.level,
  };
}

export function markPatternRead(state: PlayerState, patternSlug: string): PlayerState {
  if (state.readPatterns.includes(patternSlug)) {
    return state;
  }
  return {
    ...state,
    readPatterns: [...state.readPatterns, patternSlug],
  };
}

export function markPatternCompleted(state: PlayerState, patternSlug: string): PlayerState {
  if (state.completedPatterns.includes(patternSlug)) {
    return state;
  }
  return {
    ...state,
    completedPatterns: [...state.completedPatterns, patternSlug],
  };
}

export function saveQuizScore(state: PlayerState, patternSlug: string, percentage: number): PlayerState {
  return {
    ...state,
    quizScores: { ...state.quizScores, [patternSlug]: percentage },
  };
}

export function addBadge(state: PlayerState, badgeId: string): PlayerState {
  if (state.badges.includes(badgeId)) {
    return state;
  }
  return {
    ...state,
    badges: [...state.badges, badgeId],
  };
}

export function updateStreak(state: PlayerState): PlayerState {
  const today = new Date().toISOString().split("T")[0];

  if (state.lastActiveDate === today) {
    return state;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const isConsecutive = state.lastActiveDate === yesterday;

  return {
    ...state,
    currentStreak: isConsecutive ? state.currentStreak + 1 : 1,
    lastActiveDate: today,
  };
}

export function getPatternStatus(state: PlayerState, patternSlug: string): PatternStatus {
  if (state.completedPatterns.includes(patternSlug)) {
    return "completed";
  }

  const pattern = PATTERN_METADATA.find((p) => p.slug === patternSlug);
  if (!pattern) {
    return "locked";
  }

  const allPrerequisitesMet = pattern.prerequisites.every((prereq) =>
    state.completedPatterns.includes(prereq)
  );

  if (pattern.prerequisites.length === 0 || allPrerequisitesMet) {
    return "available";
  }

  return "locked";
}

export function getRealmProgress(state: PlayerState, category: PatternCategory): { completed: number; total: number; percentage: number } {
  const patterns = getPatternsByCategory(category);
  const completed = patterns.filter((p) => state.completedPatterns.includes(p.slug)).length;
  const total = patterns.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function isRealmComplete(state: PlayerState, category: PatternCategory): boolean {
  const { percentage } = getRealmProgress(state, category);
  return percentage === 100;
}

export function collectCoin(state: PlayerState, coinId: string): PlayerState {
  if (state.collectedCoins.includes(coinId)) {
    return state;
  }
  return {
    ...state,
    coins: state.coins + 1,
    collectedCoins: [...state.collectedCoins, coinId],
  };
}

export function spendCoins(state: PlayerState, amount: number): PlayerState {
  if (state.coins < amount) {
    return state;
  }
  return {
    ...state,
    coins: state.coins - amount,
  };
}

export function addToInventory(state: PlayerState, itemId: string): PlayerState {
  if (state.inventory.includes(itemId)) {
    return state;
  }
  return {
    ...state,
    inventory: [...state.inventory, itemId],
  };
}

export function toggleEffect(state: PlayerState, effectId: string): PlayerState {
  const isActive = state.activeEffects.includes(effectId);
  return {
    ...state,
    activeEffects: isActive
      ? state.activeEffects.filter((e) => e !== effectId)
      : [...state.activeEffects, effectId],
  };
}

export function setPlayerName(state: PlayerState, name: string): PlayerState {
  return { ...state, playerName: name };
}
