import { test } from '@playwright/test';
import { VerifyTextPage } from '../../pages/ui-testing-playground/VerifyTextPage';

test('Verify Text: Finding an element by displayed text has nuances', async ({ page }) => {
    const verifyTextPage = new VerifyTextPage(page);

    await verifyTextPage.goto();
    await verifyTextPage.navigateToVerifyText();
    await verifyTextPage.verifyButtonVisible();
});
