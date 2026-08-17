import { test } from 'playwright/test';
import { TextInputPage } from '../../pages/uiTestingPlayground/TextInputPage';

test('Text Input: Enter text and verify button label changes', async ({ page }) => {
    const textInputPage = new TextInputPage(page);
    const testText = 'Test Button Name';

    await textInputPage.goto();
    await textInputPage.navigateToTextInput();
    await textInputPage.enterText(testText);
    await textInputPage.clickButton();
    await textInputPage.verifyButtonText(testText);
});
