import { test } from 'playwright/test';
import { VisibilityPage } from '../../pages/uiTestingPlayground/VisibilityPage';

test('Visibility: Verify zero width button is not visible after hide', async ({ page }) => {
    const visibilityPage = new VisibilityPage(page);

    await visibilityPage.goto();
    await visibilityPage.navigateToVisibility();
    await visibilityPage.clickHideButton();
    await visibilityPage.verifyZeroWidthButtonNotVisible();
});
