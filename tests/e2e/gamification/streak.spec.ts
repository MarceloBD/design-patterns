import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Streak Tracking", () => {
  test("displays current streak for active players", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("3 day streak")).toBeVisible();
  });

  test("streak increments on new day activity", async ({ freshPage }) => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    await freshPage.addInitScript((yesterdayDate: string) => {
      localStorage.setItem("design-patterns-player", JSON.stringify({
        playerName: "StreakTester",
        currentXp: 100,
        level: 1,
        completedPatterns: [],
        quizScores: {},
        badges: [],
        currentStreak: 5,
        lastActiveDate: yesterdayDate,
        readPatterns: [],
      }));
    }, yesterday);

    await freshPage.goto("/quest/factory-method");
    await waitForHydration(freshPage);

    await freshPage.waitForFunction(() => {
      const stored = localStorage.getItem("design-patterns-player");
      if (!stored) return false;
      const state = JSON.parse(stored);
      return state.readPatterns.includes("factory-method");
    }, { timeout: 5000 });

    const stored = await freshPage.evaluate(() => {
      return JSON.parse(localStorage.getItem("design-patterns-player") || "{}");
    });

    expect(stored.currentStreak).toBe(6);
  });
});
