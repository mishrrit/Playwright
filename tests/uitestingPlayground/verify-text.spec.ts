import { test } from 'playwright/test';
import { VerifyTextPage } from '../../pages/uiTestingPlayground/VerifyTextPage';

test('Verify Text: Finding an element by displayed text has nuances', async ({ page }) => {
    const verifyTextPage = new VerifyTextPage(page);

    await verifyTextPage.goto();
    await verifyTextPage.navigateToVerifyText();
    await verifyTextPage.verifyButtonVisible();
});
