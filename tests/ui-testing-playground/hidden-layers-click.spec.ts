import { test } from '@playwright/test';
import { HiddenLayersPage } from '../../pages/ui-testing-playground/HiddenLayersPage';

test('Hidden Layers: Click green button and verify enabled', async ({ page }) => {
    const hiddenLayersPage = new HiddenLayersPage(page);

    await hiddenLayersPage.goto();
    await hiddenLayersPage.navigateToHiddenLayers();
    await hiddenLayersPage.clickGreenButton();
    await hiddenLayersPage.verifyButtonEnabled();
});
