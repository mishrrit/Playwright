import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class HomePage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly searchBox: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole("heading", {
      name: "Welcome to our store",
    });
    this.searchBox = page.getByRole("textbox").first();
  }

  async goto(): Promise<void> {
    await super.goto("/");
  }

  async searchFor(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press("Enter");
  }
}
