import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicIdPage extends BasePage {
    readonly dynamicButton: Locator = this.page.getByRole('button',
        { name: 'Button with Dynamic ID' });

    async navigateToDynamicId() {
        await this.clickLink('Dynamic ID');
    }

    async clickDynamicButton() {
        await this.dynamicButton.click();
    }

    async verifyDynamicButtonVisible() {
        await expect(this.dynamicButton).toBeVisible();
    }
}
