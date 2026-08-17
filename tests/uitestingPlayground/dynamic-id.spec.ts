import { test } from 'playwright/test';
import { DynamicIdPage } from '../../pages/uiTestingPlayground/DynamicIdPage';

test('Dynamic ID: Click button with dynamic ID', async ({ page }) => {
    const dynamicIdPage = new DynamicIdPage(page);

    await dynamicIdPage.goto();
    await dynamicIdPage.navigateToDynamicId();
    await dynamicIdPage.clickDynamicButton();
    await dynamicIdPage.verifyDynamicButtonVisible();
});
