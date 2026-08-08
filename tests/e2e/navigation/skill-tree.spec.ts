import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Skill Tree Page", () => {
  test("renders skill tree with all 22 pattern nodes", async ({ gamePage }) => {
    await gamePage.goto("/skill-tree");
    await waitForHydration(gamePage);
    await expect(gamePage.getByRole("heading", { name: "Skill Tree" })).toBeVisible();

    const tree = gamePage.locator("svg[aria-label='Design Patterns Skill Tree']");
    await expect(tree).toBeVisible();

    await expect(gamePage.locator("[aria-label*='Factory Method']")).toBeVisible();
    await expect(gamePage.locator("[aria-label*='Singleton']")).toBeVisible();
    await expect(gamePage.locator("[aria-label*='Visitor']")).toBeVisible();
  });

  test("shows completed patterns with correct state", async ({ gamePage }) => {
    await gamePage.goto("/skill-tree");
    await waitForHydration(gamePage);
    const factoryNode = gamePage.locator("[aria-label='Factory Method - completed']");
    await expect(factoryNode).toBeVisible();
  });

  test("clicking available pattern navigates to quest", async ({ gamePage }) => {
    await gamePage.goto("/skill-tree");
    await waitForHydration(gamePage);
    const protoNode = gamePage.locator("[aria-label='Prototype - available']");
    await protoNode.click();
    await expect(gamePage).toHaveURL("/quest/prototype");
  });

  test("shows legend for node states", async ({ gamePage }) => {
    await gamePage.goto("/skill-tree");
    await expect(gamePage.locator(".flex.justify-center.gap-6").getByText("Completed")).toBeVisible();
    await expect(gamePage.locator(".flex.justify-center.gap-6").getByText("Available")).toBeVisible();
    await expect(gamePage.locator(".flex.justify-center.gap-6").getByText("Locked")).toBeVisible();
  });
});
