import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Realm Pages", () => {
  test("creational realm lists 5 patterns", async ({ gamePage }) => {
    await gamePage.goto("/realm/creational");
    await waitForHydration(gamePage);
    await expect(gamePage.getByRole("heading", { name: "Creational Realm" })).toBeVisible();
    await expect(gamePage.getByText("Factory Method")).toBeVisible();
    await expect(gamePage.getByText("Singleton")).toBeVisible();
    await expect(gamePage.getByText("5 patterns to master")).toBeVisible();
  });

  test("structural realm lists 7 patterns", async ({ gamePage }) => {
    await gamePage.goto("/realm/structural");
    await waitForHydration(gamePage);
    await expect(gamePage.getByRole("heading", { name: "Structural Realm" })).toBeVisible();
    await expect(gamePage.getByText("Adapter")).toBeVisible();
    await expect(gamePage.getByText("Proxy")).toBeVisible();
  });

  test("behavioral realm lists 10 patterns", async ({ gamePage }) => {
    await gamePage.goto("/realm/behavioral");
    await waitForHydration(gamePage);
    await expect(gamePage.getByRole("heading", { name: "Behavioral Realm" })).toBeVisible();
    await expect(gamePage.getByText("Observer")).toBeVisible();
    await expect(gamePage.getByText("Visitor")).toBeVisible();
  });
});
