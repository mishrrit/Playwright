import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class ClassAttributePage extends BasePage {
    readonly primaryButton: Locator = this.page.locator('button.btn-primary');

    async navigateToClassAttribute() {
        await this.clickLink('Class Attribute');
    }

    async setupDialogHandler() {
        this.page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Primary button pressed');
            await this.page.waitForTimeout(1000);
            await dialog.accept();
        });
    }

    async clickPrimaryButton() {
        await this.primaryButton.click({ timeout: 15000 });
    }
}
