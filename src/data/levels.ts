import { LevelDefinition } from "@/types/player";

export const LEVELS: LevelDefinition[] = [
  { level: 1, title: "Code Apprentice", xpRequired: 0 },
  { level: 2, title: "Pattern Seeker", xpRequired: 200 },
  { level: 3, title: "Design Initiate", xpRequired: 500 },
  { level: 4, title: "Pattern Wielder", xpRequired: 1000 },
  { level: 5, title: "Architecture Knight", xpRequired: 1800 },
  { level: 6, title: "Design Sage", xpRequired: 2800 },
  { level: 7, title: "Pattern Master", xpRequired: 4000 },
];

export const XP_REWARDS = {
  READ_PATTERN: 10,
  QUIZ_PASS: 150,
  QUIZ_PERFECT: 75,
  REALM_COMPLETE: 300,
} as const;

export function getLevelForXp(xp: number): LevelDefinition {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    }
  }
  return currentLevel;
}

export function getXpToNextLevel(xp: number): { current: number; required: number; progress: number } {
  const currentLevel = getLevelForXp(xp);
  const currentLevelIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return { current: xp, required: xp, progress: 100 };
  }

  const xpInCurrentLevel = xp - currentLevel.xpRequired;
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = Math.round((xpInCurrentLevel / xpNeededForNext) * 100);

  return { current: xpInCurrentLevel, required: xpNeededForNext, progress };
}
