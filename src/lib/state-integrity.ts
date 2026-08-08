import { PlayerState } from "@/types/player";
import { PATTERN_METADATA, getPatternsByCategory } from "@/data/patterns";
import { PatternCategory } from "@/types/pattern";

const INTEGRITY_KEY = "design-patterns-integrity";
const SALT_PARTS = ["d3s1gn", "p4tt3rn", "qu3st", "2024"];

function getSalt(): string {
  return SALT_PARTS.map((part) => part.split("").reverse().join("")).join("-");
}

function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }

  let secondary = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    secondary ^= input.charCodeAt(i);
    secondary = Math.imul(secondary, 0x01000193);
  }

  const hex1 = (hash >>> 0).toString(16).padStart(8, "0");
  const hex2 = (secondary >>> 0).toString(16).padStart(8, "0");
  return `${hex1}${hex2}`;
}

function computeIntegrity(state: PlayerState): string {
  const critical = {
    coins: state.coins,
    collectedCoins: [...state.collectedCoins].sort(),
    completedPatterns: [...state.completedPatterns].sort(),
    currentXp: state.currentXp,
    inventory: [...state.inventory].sort(),
    quizScores: state.quizScores,
  };

  const payload = JSON.stringify(critical) + getSalt();
  return hashString(payload);
}

export function generateIntegrity(state: PlayerState): string {
  return computeIntegrity(state);
}

export function saveIntegrity(state: PlayerState): void {
  if (typeof window === "undefined") return;
  const hash = computeIntegrity(state);
  localStorage.setItem(INTEGRITY_KEY, hash);
}

export function verifyIntegrity(state: PlayerState): boolean {
  if (typeof window === "undefined") return true;

  const stored = localStorage.getItem(INTEGRITY_KEY);
  if (!stored) return true;

  const expected = computeIntegrity(state);
  return stored === expected;
}

function getValidCoinIds(): string[] {
  return PATTERN_METADATA.flatMap((pattern) => [
    `${pattern.slug}-hook`,
    `${pattern.slug}-solution`,
  ]);
}

function getValidPatternSlugs(): string[] {
  return PATTERN_METADATA.map((pattern) => pattern.slug);
}

function checkPrerequisites(completedPatterns: string[]): boolean {
  for (const slug of completedPatterns) {
    const pattern = PATTERN_METADATA.find((p) => p.slug === slug);
    if (!pattern) return false;

    for (const prereq of pattern.prerequisites) {
      if (!completedPatterns.includes(prereq)) return false;
    }
  }
  return true;
}

export function validateState(state: PlayerState): PlayerState {
  const validCoinIds = getValidCoinIds();
  const validSlugs = getValidPatternSlugs();

  const cleanedCollectedCoins = state.collectedCoins.filter((coinId) =>
    validCoinIds.includes(coinId)
  );

  const expectedCoins = cleanedCollectedCoins.length;

  const cleanedCompletedPatterns = state.completedPatterns.filter((slug) =>
    validSlugs.includes(slug)
  );

  const validCompletedPatterns = checkPrerequisites(cleanedCompletedPatterns)
    ? cleanedCompletedPatterns
    : rebuildValidCompletionOrder(cleanedCompletedPatterns);

  const maxPossibleXp = validCompletedPatterns.length * 200 + cleanedCollectedCoins.length * 10 + 22 * 50;
  const validXp = Math.min(Math.max(0, state.currentXp), maxPossibleXp);

  const cleanedQuizScores: Record<string, number> = {};
  for (const [slug, score] of Object.entries(state.quizScores)) {
    if (validSlugs.includes(slug) && score >= 0 && score <= 100) {
      cleanedQuizScores[slug] = score;
    }
  }

  const validInventory = state.inventory.filter((itemId) =>
    typeof itemId === "string" && itemId.length > 0 && itemId.length < 50
  );

  return {
    ...state,
    coins: expectedCoins,
    collectedCoins: cleanedCollectedCoins,
    completedPatterns: validCompletedPatterns,
    currentXp: validXp,
    quizScores: cleanedQuizScores,
    inventory: validInventory,
    level: Math.max(1, Math.min(state.level, 50)),
    currentStreak: Math.max(0, Math.min(state.currentStreak, 365)),
  };
}

function rebuildValidCompletionOrder(completedPatterns: string[]): string[] {
  const result: string[] = [];
  const categories: PatternCategory[] = ["creational", "structural", "behavioral"];

  for (const category of categories) {
    const patternsInCategory = getPatternsByCategory(category);
    for (const pattern of patternsInCategory) {
      if (completedPatterns.includes(pattern.slug)) {
        const prerequisitesMet = pattern.prerequisites.every((prereq) =>
          result.includes(prereq)
        );
        if (prerequisitesMet) {
          result.push(pattern.slug);
        }
      }
    }
  }

  return result;
}
