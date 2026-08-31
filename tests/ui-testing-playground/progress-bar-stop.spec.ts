import { test } from '@playwright/test';
import { ProgressBarPage } from '../../pages/ui-testing-playground/ProgressBarPage';

test('Progress Bar: Stop at 75% and verify final value', async ({ page }) => {
    const progressBarPage = new ProgressBarPage(page);

    await progressBarPage.goto();
    await progressBarPage.navigateToProgressBar();
    await progressBarPage.clickStart();
    await progressBarPage.waitForProgressValue(75);
    await progressBarPage.clickStop();

    const finalValue = await progressBarPage.getProgressValue();
    console.log(`Stopped at: ${finalValue}%`);
});
