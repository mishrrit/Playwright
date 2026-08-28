import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class AjaxDataPage extends BasePage {
    readonly ajaxButton: Locator = this.page.getByRole('button',
        { name: 'Button Triggering AJAX Request' });
    readonly responseText: Locator = this.page.getByText('Data loaded with AJAX get request.');

    async navigateToAjaxData() {
        await this.clickLink('AJAX Data');
    }

    async clickAjaxButton() {
        await this.ajaxButton.click();
    }

    async verifyResponseVisible() {
        await expect(this.responseText).toBeVisible({ timeout: 16000 });
    }
}
