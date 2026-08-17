import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class MouseOverPage extends BasePage {
    readonly clickMeLink: Locator = this.page.getByTitle('Click me');
    readonly activeLink: Locator = this.page.getByTitle('Active Link');
    readonly linkButton: Locator = this.page.getByTitle('Link Button');
    readonly clickCount: Locator = this.page.locator('#clickCount');
    readonly clickButtonCount: Locator = this.page.locator('#clickButtonCount');

    async navigateToMouseOver() {
        await this.clickLink('Mouse Over');
    }

    async hoverAndClickLink(count: number = 2) {
        await this.clickMeLink.hover();
        for (let i = 0; i < count; i++) {
            await this.activeLink.click();
        }
    }

    async hoverAndClickButton(count: number = 2) {
        await this.linkButton.hover();
        for (let i = 0; i < count; i++) {
            await this.linkButton.click();
        }
    }

    async verifyClickCount(expectedCount: string) {
        await expect(this.clickCount).toHaveText(expectedCount);
    }

    async verifyClickButtonCount(expectedCount: string) {
        await expect(this.clickButtonCount).toHaveText(expectedCount);
    }
}
