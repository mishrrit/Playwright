import { Page } from "@playwright/test";

export class LoginPage {
  readonly heading;
  readonly usernameInput;
  readonly passwordInput;
  readonly submitButton;
  readonly errorMessage;
  readonly successMessage;
  readonly logoutLink;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Test login" });
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
    // The page repeats these messages in instructional text; #error is the live validation container.
    this.errorMessage = page.locator("#error");
    this.successMessage = page.getByText(
      /Congratulations.*successfully logged in!/,
    );
    this.logoutLink = page.getByRole("link", { name: "Log out" });
  }

  async goto(): Promise<void> {
    await this.page.goto(".");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
