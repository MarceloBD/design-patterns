import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Quest Content Page", () => {
  test("displays all 7 quest sections for available pattern", async ({ gamePage }) => {
    await gamePage.goto("/quest/prototype");
    await waitForHydration(gamePage);

    await expect(gamePage.getByRole("heading", { name: "Prototype" })).toBeVisible();
    await expect(gamePage.getByText("Real-World Analogy")).toBeVisible();
    await expect(gamePage.getByRole("heading", { name: /The Problem/ })).toBeVisible();
    await expect(gamePage.getByRole("heading", { name: /The Solution/ })).toBeVisible();
    await expect(gamePage.getByText("Key Terms")).toBeVisible();
    await expect(gamePage.getByRole("heading", { name: /TypeScript Implementation/ })).toBeVisible();
    await expect(gamePage.getByRole("heading", { name: /Challenge/ })).toBeVisible();
  });

  test("shows code example block", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);
    await expect(gamePage.locator("pre code")).toBeVisible();
    await expect(gamePage.getByText("typescript", { exact: true })).toBeVisible();
  });

  test("displays glossary terms", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("Creator", { exact: true }).first()).toBeVisible();
    await expect(gamePage.getByText("Concrete Creator", { exact: true })).toBeVisible();
    await expect(gamePage.getByText("Product Interface", { exact: true })).toBeVisible();
  });

  test("shows back link to realm", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("← Creational Realm")).toBeVisible();
  });

  test("shows XP reward info", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("+150 XP on completion")).toBeVisible();
  });
});
