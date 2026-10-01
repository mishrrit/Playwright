import { test } from "../../support/fixtures/base";
import { TextInputPage } from "../../pages/ui-testing-playground/TextInputPage";
import textInputData from "../../test-data/ui-testing-playground/text-input.json";

test("Text Input: Enter text and verify button label changes", async ({
  page,
}) => {
  const textInputPage = new TextInputPage(page);

  await textInputPage.goto();
  await textInputPage.navigateToTextInput();
  await textInputPage.enterText(textInputData.buttonLabel);
  await textInputPage.clickButton();
  await textInputPage.verifyButtonText(textInputData.buttonLabel);
});
