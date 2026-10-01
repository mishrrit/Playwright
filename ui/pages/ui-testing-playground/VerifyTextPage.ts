import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class VerifyTextPage extends BasePage {
    readonly welcomeButton: Locator = this.page.locator('.badge-secondary',
        { hasText: 'Welcome...' });

    async navigateToVerifyText() {
        await this.clickLink('Verify Text');
    }

    async verifyButtonVisible() {
        await expect(this.welcomeButton).toBeVisible();
    }
}
