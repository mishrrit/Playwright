import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class ScrollBarPage extends BasePage {
    readonly hidingButton: Locator = this.page.locator('#hidingButton');

    async navigateToScrollBar() {
        await this.clickLink('Scrollbars');
    }

    async clickHidingButton() {
        await this.hidingButton.click();
    }

    async verifyButtonVisible() {
        await expect(this.hidingButton).toBeVisible();
    }
}
