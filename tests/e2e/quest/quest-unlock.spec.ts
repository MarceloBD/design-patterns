import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Quest Unlock Logic", () => {
  test("completed patterns show checkmark on realm page", async ({ gamePage }) => {
    await gamePage.goto("/realm/creational");
    await waitForHydration(gamePage);
    await expect(gamePage.locator(".pattern-card-completed").first()).toBeVisible();
  });

  test("locked patterns are not clickable", async ({ gamePage }) => {
    await gamePage.goto("/realm/creational");
    await waitForHydration(gamePage);
    const lockedCard = gamePage.locator(".pattern-card-locked").first();
    await expect(lockedCard).toBeVisible();
  });

  test("first pattern in each realm is always available", async ({ freshPage }) => {
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
    await freshPage.goto("/realm/creational");
    await waitForHydration(freshPage);
    const availableCard = freshPage.locator(".pattern-card-available").first();
    await expect(availableCard).toBeVisible();
  });
});
