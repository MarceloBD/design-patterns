import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("XP Awards", () => {
  test("reading a pattern awards XP on first visit", async ({ freshPage }) => {
    await freshPage.addInitScript(() => {
      localStorage.setItem("design-patterns-player", JSON.stringify({
        playerName: "XpTester",
        currentXp: 0,
        level: 1,
        completedPatterns: [],
        quizScores: {},
        badges: [],
        currentStreak: 0,
        lastActiveDate: "",
        readPatterns: [],
      }));
    });

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

    expect(stored.currentXp).toBe(50);
    expect(stored.readPatterns).toContain("factory-method");
  });

  test("reading same pattern twice does not double XP", async ({ freshPage }) => {
    await freshPage.addInitScript(() => {
      localStorage.setItem("design-patterns-player", JSON.stringify({
        playerName: "XpTester",
        currentXp: 50,
        level: 1,
        completedPatterns: [],
        quizScores: {},
        badges: [],
        currentStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        readPatterns: ["factory-method"],
      }));
    });

    await freshPage.goto("/quest/factory-method");
    await waitForHydration(freshPage);
    await freshPage.waitForTimeout(1000);

    const stored = await freshPage.evaluate(() => {
      return JSON.parse(localStorage.getItem("design-patterns-player") || "{}");
    });

    expect(stored.currentXp).toBe(50);
  });

  test("XP bar reflects current progress", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("1500 XP total")).toBeVisible();
  });
});
