import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.locator("#user-name");
    this.password = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorContainer = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await super.goto("/");
  }

  async login(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    if ((await this.errorContainer.count()) === 0) return "";
    return (await this.errorContainer.innerText()).trim();
  }
}
