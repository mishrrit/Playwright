import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class SampleAppPage extends BasePage {
    readonly usernameInput: Locator = this.page.locator('input[name="UserName"]');
    readonly passwordInput: Locator = this.page.locator('input[name="Password"]');
    readonly loginButton: Locator = this.page.getByRole('button', { name: 'Log In' });
    readonly loginStatus: Locator = this.page.locator('#loginstatus');

    async navigateToSampleApp() {
        await this.clickLink('Sample App');
    }

    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async verifyLoginStatus(expectedStatus: string) {
        await expect(this.loginStatus).toHaveText(expectedStatus);
    }

    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}
