import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole("textbox", { name: "Email:" });
    this.passwordInput = page.getByRole("textbox", { name: "Password:" });
    this.loginButton = page.getByRole("button", { name: "Log in" });
    this.welcomeHeading = page.getByRole("heading", {
      name: "Welcome, Please Sign In!",
    });
  }

  async goto(): Promise<void> {
    await super.goto("/login");
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }
}
