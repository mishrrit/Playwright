import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class TextInputPage extends BasePage {
    readonly inputField: Locator = this.page.locator('#newButtonName');
    readonly buttonLabel: Locator = this.page.locator('.btn-primary');

    async navigateToTextInput() {
        await this.clickLink('Text Input');
    }

    async enterText(text: string) {
        await this.inputField.fill(text);
    }

    async clickButton() {
        await this.buttonLabel.click();
    }

    async verifyButtonText(expectedText: string) {
        await expect(this.buttonLabel).toHaveText(expectedText);
    }
}
