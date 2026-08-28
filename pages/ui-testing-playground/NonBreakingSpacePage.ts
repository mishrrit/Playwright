import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class NonBreakingSpacePage extends BasePage {
    readonly myButton: Locator = this.page.getByRole('button', { name: 'My Button' });

    async navigateToNonBreakingSpace() {
        await this.clickLink('Non-Breaking Space');
    }

    async verifyButtonVisible() {
        await expect(this.myButton).toBeVisible();
    }
}
