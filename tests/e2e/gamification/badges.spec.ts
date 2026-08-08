import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Badges", () => {
  test("player badge count displays correctly", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("4").locator("xpath=./following-sibling::div[contains(.,'Badges')] | ./parent::div[contains(.,'Badges')]").first()).toBeVisible();
  });

  test("completed patterns count displays correctly", async ({ gamePage }) => {
    await gamePage.goto("/");
    await waitForHydration(gamePage);
    const statsGrid = gamePage.locator("[data-hydrated] .grid-cols-3");
    await expect(statsGrid.getByText("3")).toBeVisible();
    await expect(statsGrid.getByText("Patterns")).toBeVisible();
  });
});
