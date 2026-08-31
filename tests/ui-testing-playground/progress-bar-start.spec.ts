import { test } from '@playwright/test';
import { ProgressBarPage } from '../../pages/ui-testing-playground/ProgressBarPage';

test('Progress Bar: Start progress bar and wait for 75%', async ({ page }) => {
    const progressBarPage = new ProgressBarPage(page);

    await progressBarPage.goto();
    await progressBarPage.navigateToProgressBar();
    await progressBarPage.clickStart();
    await progressBarPage.waitForProgressValue(75);

    const value = await progressBarPage.getProgressValue();
    console.log(`Progress reached: ${value}%`);
});
