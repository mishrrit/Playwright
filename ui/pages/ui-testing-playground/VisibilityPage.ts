import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class VisibilityPage extends BasePage {
    readonly hideButton: Locator = this.page.getByRole('button', { name: 'Hide' });
    readonly removedButton: Locator = this.page.locator('#removedButton');
    readonly zeroWidthButton: Locator = this.page.locator('#zeroWidthButton');
    readonly overlappedButton: Locator = this.page.locator('#overlappedButton');

    async navigateToVisibility() {
        await this.clickLink('Visibility');
    }

    async clickHideButton() {
        await this.hideButton.click();
    }

    async verifyRemovedButtonNotVisible() {
        await expect(this.removedButton).not.toBeVisible();
    }

    async verifyZeroWidthButtonNotVisible() {
        await expect(this.zeroWidthButton).not.toBeVisible();
    }

    async verifyOverlappedButtonVisible() {
        await expect(this.overlappedButton).toBeVisible();
    }
}
