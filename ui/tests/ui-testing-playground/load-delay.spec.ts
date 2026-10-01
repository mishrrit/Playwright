import { test } from "../../support/fixtures/base";
import { LoadDelayPage } from '../../pages/ui-testing-playground/LoadDelayPage';

test('Load Delay: Test for page loading and element visibility', async ({ page }) => {
    const loadDelayPage = new LoadDelayPage(page);

    await loadDelayPage.goto();
    await loadDelayPage.navigateToLoadDelay();
    await loadDelayPage.verifyButtonVisible();
});
