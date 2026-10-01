import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class ShadowDomPage extends BasePage {
    readonly cogIcon: Locator = this.page.locator('.fa-cog').last();
    readonly cloneIcon: Locator = this.page.locator('.fa-clone').last();
    readonly editField: Locator = this.page.locator('#editField');

    async navigateToShadowDom() {
        await this.clickLink('Shadow DOM');
    }

    async clickCogIcon() {
        await this.cogIcon.click();
    }

    async clickCloneIcon() {
        await this.cloneIcon.click();
    }

    async copyToClipboard() {
        await this.clickCloneIcon();
        await this.page.waitForTimeout(1000);
    }

    async getEditFieldContent(): Promise<string | null> {
        return this.editField.textContent();
    }

    async getClipboardContent(): Promise<string> {
        return this.page.evaluate(() => navigator.clipboard.readText());
    }

    async verifyClipboardMatchesEditField() {
        const clipboardContent = await this.getClipboardContent();
        const fieldContent = await this.getEditFieldContent();
        console.log('guid is ' + fieldContent);
        expect(clipboardContent).toBe(fieldContent);
    }
}
