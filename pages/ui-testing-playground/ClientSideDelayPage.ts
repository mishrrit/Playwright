import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class ClientSideDelayPage extends BasePage {
    readonly clientButton: Locator = this.page.getByRole('button',
        { name: 'Button Triggering Client Side Logic' });
    readonly resultText: Locator = this.page.getByText('Data calculated on the client side.');

    async navigateToClientSideDelay() {
        await this.clickLink('Client Side Delay');
    }

    async clickClientButton() {
        await this.clientButton.click();
    }

    async verifyResultVisible() {
        await expect(this.resultText).toBeVisible({ timeout: 16000 });
    }
}
