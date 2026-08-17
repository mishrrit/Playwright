import { test } from 'playwright/test';
import { LoadDelayPage } from '../../pages/uiTestingPlayground/LoadDelayPage';

test('Load Delay: Test for page loading and element visibility', async ({ page }) => {
    const loadDelayPage = new LoadDelayPage(page);

    await loadDelayPage.goto();
    await loadDelayPage.navigateToLoadDelay();
    await loadDelayPage.verifyButtonVisible();
});
