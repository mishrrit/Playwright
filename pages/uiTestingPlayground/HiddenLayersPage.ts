import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class HiddenLayersPage extends BasePage {
    readonly greenButton: Locator = this.page.locator('#greenButton');

    async navigateToHiddenLayers() {
        await this.clickLink('Hidden Layers');
    }

    async clickGreenButton() {
        await this.greenButton.click();
    }

    async verifyButtonEnabled() {
        await expect(this.greenButton).toBeEnabled();
    }

    async isButtonClickable(): Promise<boolean> {
        try {
            await this.greenButton.click({
                trial: true,
                timeout: 3000
            });
            return true;
        } catch {
            return false;
        }
    }

    async verifyButtonNotClickable() {
        const clickable = await this.isButtonClickable();
        expect(clickable).toBeFalsy();
    }
}
