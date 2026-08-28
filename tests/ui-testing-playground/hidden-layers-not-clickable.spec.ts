import { test } from '@playwright/test';
import { HiddenLayersPage } from '../../pages/ui-testing-playground/HiddenLayersPage';

test('Hidden Layers: Verify green button cannot be clicked twice', async ({ page }) => {
    const hiddenLayersPage = new HiddenLayersPage(page);

    await hiddenLayersPage.goto();
    await hiddenLayersPage.navigateToHiddenLayers();
    await hiddenLayersPage.clickGreenButton();
    await hiddenLayersPage.verifyButtonNotClickable();
});
