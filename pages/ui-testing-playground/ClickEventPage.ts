import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClickEventPage extends BasePage {
    readonly ignoreClickButton: Locator = this.page.getByRole('button',
        { name: 'Button That Ignores DOM Click Event' });
    readonly successButton: Locator = this.page.locator('.btn-success');

    async navigateToClickEvent() {
        await this.page.getByRole('link', { name: 'Click', exact: true }).click();
    }

    async clickIgnoreButton() {
        await this.ignoreClickButton.click();
    }

    async verifySuccessButtonEnabled() {
        await expect(this.successButton).toBeEnabled();
    }

}
