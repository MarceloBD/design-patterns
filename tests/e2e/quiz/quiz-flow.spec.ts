import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Quiz Flow", () => {
  test("renders quiz questions with options", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);
    await expect(gamePage.getByText("Question 1 of 5")).toBeVisible();
  });

  test("allows selecting an answer", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);
    const firstOption = gamePage.getByRole("button", { name: /Avoiding direct object/ });
    await firstOption.click();
    await expect(firstOption).toHaveCSS("border-color", /rgb/);
  });

  test("navigates between questions", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);

    const quizSection = gamePage.locator("[class*='rounded-xl']").filter({ hasText: "Question 1 of 5" });
    const options = quizSection.locator("button").filter({ hasText: /\w{5,}/ });
    await options.first().click();

    await gamePage.getByRole("button", { name: "Next →" }).click();
    await expect(gamePage.getByText("Question 2 of 5")).toBeVisible();

    await gamePage.getByRole("button", { name: "← Previous" }).click();
    await expect(gamePage.getByText("Question 1 of 5")).toBeVisible();
  });

  test("shows submit button on last question", async ({ gamePage }) => {
    await gamePage.goto("/quest/factory-method");
    await waitForHydration(gamePage);

    for (let questionIndex = 0; questionIndex < 5; questionIndex++) {
      const quizOptions = gamePage.locator("button").filter({ hasText: /^(?!.*Next|.*Previous|.*Submit).*\w{5,}/ });
      await quizOptions.first().click();
      if (questionIndex < 4) {
        await gamePage.getByRole("button", { name: "Next →" }).click();
      }
    }

    await expect(gamePage.getByRole("button", { name: "Submit Quiz" })).toBeVisible();
  });

  test("shows results after submission", async ({ gamePage }) => {
    await gamePage.goto("/quest/prototype");
    await waitForHydration(gamePage);

    for (let questionIndex = 0; questionIndex < 5; questionIndex++) {
      const quizOptions = gamePage.locator("button").filter({ hasText: /^(?!.*Next|.*Previous|.*Submit).*\w{5,}/ });
      await quizOptions.first().click();
      if (questionIndex < 4) {
        await gamePage.getByRole("button", { name: "Next →" }).click();
      }
    }

    await gamePage.getByRole("button", { name: "Submit Quiz" }).click();
    await expect(gamePage.getByText(/You scored \d+\/5/)).toBeVisible();
  });
});
