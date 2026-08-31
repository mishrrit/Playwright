import { test } from '@playwright/test';
import { VisibilityPage } from '../../pages/ui-testing-playground/VisibilityPage';

test('Visibility: Verify removed button is not visible after hide', async ({ page }) => {
    const visibilityPage = new VisibilityPage(page);

    await visibilityPage.goto();
    await visibilityPage.navigateToVisibility();
    await visibilityPage.clickHideButton();
    await visibilityPage.verifyRemovedButtonNotVisible();
});
