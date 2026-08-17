import { Page, Locator } from 'playwright/test';

export class BasePage {
    protected page: Page;
    readonly baseUrl = 'http://uitestingplayground.com/';

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string = '') {
        await this.page.goto(this.baseUrl + path);
    }

    async waitForElement(locator: Locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
        return locator;
    }

    async getElementByDynamicText(text: string, timeout = 5000) {
        return this.waitForElement(
            this.page.getByText(text, { exact: false }),
            timeout
        );
    }

    async clickLink(linkName: string) {
        await this.page.getByRole('link', { name: linkName }).click();
    }
}
