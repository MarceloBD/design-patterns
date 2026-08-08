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
}

export interface LevelDefinition {
  level: number;
  title: string;
  xpRequired: number;
}
