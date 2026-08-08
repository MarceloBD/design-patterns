import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Landing Page", () => {
  test("displays name prompt for new players", async ({ freshPage }) => {
    await freshPage.goto("/");
    await expect(freshPage.getByText("Welcome, Adventurer!")).toBeVisible();
    await expect(freshPage.getByPlaceholder("Enter your name...")).toBeVisible();
  });

  test("allows new player to set name and start", async ({ freshPage }) => {
    await freshPage.goto("/");
    await expect(freshPage.getByText("Welcome, Adventurer!")).toBeVisible();
    await freshPage.getByPlaceholder("Enter your name...").fill("TestPlayer");
    await freshPage.getByRole("button", { name: "Begin Quest" }).click();
    await expect(freshPage.getByText("Welcome, Adventurer!")).not.toBeVisible();
  });

  test("shows player stats for returning players", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("TestHero")).toBeVisible();
    await expect(gamePage.getByRole("main").getByText("Pattern Wielder")).toBeVisible();
  });

  test("displays all three realm cards", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("Creational Realm")).toBeVisible();
    await expect(gamePage.getByText("Structural Realm")).toBeVisible();
    await expect(gamePage.getByText("Behavioral Realm")).toBeVisible();
  });

  test("navigates to skill tree", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await gamePage.getByRole("link", { name: /View Skill Tree/ }).click();
    await expect(gamePage).toHaveURL("/skill-tree");
  });

  test("navigates to realm page via card", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await gamePage.locator("a[href='/realm/creational']").first().click();
    await expect(gamePage).toHaveURL("/realm/creational");
  });
});
