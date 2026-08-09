export interface HeroAppearance {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  hat: string;
  shirt: string;
  pants: string;
}

export interface PlayerState {
  playerName: string;
  currentXp: number;
  level: number;
  completedPatterns: string[];
  quizScores: Record<string, number>;
  badges: string[];
  currentStreak: number;
  lastActiveDate: string;
  readPatterns: string[];
  coins: number;
  collectedCoins: string[];
  inventory: string[];
  activeEffects: string[];
  heroAppearance: HeroAppearance;
}

export interface LevelDefinition {
  level: number;
  title: string;
  xpRequired: number;
}
