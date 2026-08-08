import { test as base, type Page } from "@playwright/test";

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
}

const EXPERIENCED_PLAYER: PlayerState = {
  playerName: "TestHero",
  currentXp: 1500,
  level: 4,
  completedPatterns: ["factory-method", "abstract-factory", "builder"],
  quizScores: { "factory-method": 100, "abstract-factory": 80, builder: 60 },
  badges: ["factory-method", "abstract-factory", "builder", "perfect-score"],
  currentStreak: 3,
  lastActiveDate: new Date().toISOString().split("T")[0],
  readPatterns: ["factory-method", "abstract-factory", "builder", "prototype"],
};

export interface GameFixtures {
  gamePage: Page;
  freshPage: Page;
}

export const gameTest = base.extend<GameFixtures>({
  gamePage: async ({ page }, use) => {
    await page.addInitScript((state) => {
      localStorage.setItem("design-patterns-player", JSON.stringify(state));
    }, EXPERIENCED_PLAYER);
    await use(page);
  },
  freshPage: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.removeItem("design-patterns-player");
    });
    await use(page);
  },
});

export async function waitForHydration(page: Page, timeout = 10_000): Promise<void> {
  await page.waitForFunction(
    () => document.querySelector("[data-hydrated]") !== null,
    { timeout }
  );
}

export { expect } from "@playwright/test";
