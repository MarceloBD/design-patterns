import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Level Up", () => {
  test("player level matches XP threshold", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByRole("main").getByText("Pattern Wielder")).toBeVisible();
  });

  test("level 1 player shows Code Apprentice title", async ({ freshPage }) => {
    await freshPage.addInitScript(() => {
      localStorage.setItem("design-patterns-player", JSON.stringify({
        playerName: "Newbie",
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

    await freshPage.goto("/");
    await waitForHydration(freshPage);
    await expect(freshPage.getByRole("main").getByText("Code Apprentice")).toBeVisible();
  });

  test("max level player shows Pattern Master", async ({ freshPage }) => {
    await freshPage.addInitScript(() => {
      localStorage.setItem("design-patterns-player", JSON.stringify({
        playerName: "Master",
        currentXp: 4500,
        level: 7,
        completedPatterns: [],
        quizScores: {},
        badges: [],
        currentStreak: 0,
        lastActiveDate: "",
        readPatterns: [],
      }));
    });

    await freshPage.goto("/");
    await waitForHydration(freshPage);
    await expect(freshPage.getByRole("main").getByText("Pattern Master")).toBeVisible();
  });
});
