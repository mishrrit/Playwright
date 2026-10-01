import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class LoadDelayPage extends BasePage {
    readonly delayedButton: Locator = this.page.getByRole('button',
        { name: 'Button Appearing After Delay' });

    async navigateToLoadDelay() {
        await this.clickLink('Load Delay');
    }

    async verifyButtonVisible() {
        await expect(this.delayedButton).toBeVisible({ timeout: 10000 });
    }
}
