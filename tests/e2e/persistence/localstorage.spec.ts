import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("LocalStorage Persistence", () => {
  test("state persists after page reload", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("TestHero")).toBeVisible();

    await gamePage.reload();
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("TestHero")).toBeVisible();
    await expect(gamePage.getByText("1500 XP total")).toBeVisible();
  });

  test("empty storage shows welcome prompt for new players", async ({ freshPage }) => {
    await freshPage.goto("/");
    await expect(freshPage.getByText("Welcome, Adventurer!")).toBeVisible();
    await expect(freshPage.getByPlaceholder("Enter your name...")).toBeVisible();
  });

  test("corrupted storage recovers gracefully", async ({ freshPage }) => {
    await freshPage.addInitScript(() => {
      localStorage.setItem("design-patterns-player", "not-valid-json{{{");
    });

    await freshPage.goto("/");
    await freshPage.waitForLoadState("networkidle");
    await expect(freshPage.getByText("Welcome, Adventurer!")).toBeVisible();
  });
});
