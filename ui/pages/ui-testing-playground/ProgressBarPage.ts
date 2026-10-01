import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class ProgressBarPage extends BasePage {
    readonly startButton: Locator = this.page.getByRole('button', { name: 'Start' });
    readonly stopButton: Locator = this.page.locator('#stopButton');
    readonly progressBar: Locator = this.page.locator('#progressBar');
    readonly resultText: Locator = this.page.locator('#result');

    async navigateToProgressBar() {
        await this.clickLink('Progress Bar');
    }

    async clickStart() {
        await this.startButton.click();
    }

    async clickStop() {
        await this.stopButton.click();
    }

    async waitForProgressValue(targetValue: number, timeout = 20000) {
        await expect.poll(
            async () => {
                const currentValue = await this.progressBar.getAttribute('aria-valuenow');
                return Number(currentValue);
            },
            { timeout, intervals: [10] }
        ).toBeGreaterThanOrEqual(targetValue);
    }

    async getProgressValue(): Promise<number> {
        const value = await this.progressBar.getAttribute('aria-valuenow');
        return Number(value);
    }

    async getResultText(): Promise<string | null> {
        return this.resultText.innerText();
    }
}
