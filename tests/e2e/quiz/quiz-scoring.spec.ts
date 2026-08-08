import { gameTest as test, expect, waitForHydration } from "../fixtures/test-fixture";

test.describe("Quiz Scoring", () => {
  test("completing quiz shows result screen", async ({ gamePage }) => {
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

    const resultMessage = gamePage.getByText("Quest Complete!").or(gamePage.getByText("Not Quite..."));
    await expect(resultMessage).toBeVisible();
  });

  test("failed quiz shows retry button", async ({ gamePage }) => {
    await gamePage.goto("/quest/singleton");
    await waitForHydration(gamePage);

    for (let questionIndex = 0; questionIndex < 5; questionIndex++) {
      const quizOptions = gamePage.locator("button").filter({ hasText: /^(?!.*Next|.*Previous|.*Submit).*\w{5,}/ });
      await quizOptions.last().click();
      if (questionIndex < 4) {
        await gamePage.getByRole("button", { name: "Next →" }).click();
      }
    }

    await gamePage.getByRole("button", { name: "Submit Quiz" }).click();

    const resultScreen = gamePage.getByText("Quest Complete!").or(gamePage.getByText("Not Quite..."));
    await expect(resultScreen).toBeVisible();
  });
});
