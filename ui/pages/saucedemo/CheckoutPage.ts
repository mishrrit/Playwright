import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class CheckoutPage extends BasePage {
  readonly firstName = "#first-name";
  readonly lastName = "#last-name";
  readonly postal = "#postal-code";
  readonly continueButton = "#continue";
  readonly finishButton = "#finish";
  readonly completeHeader = "h2";
  readonly completionMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.completionMessage = page.locator(".complete-header");
  }

  async fillInfo(first: string, last: string, zip: string): Promise<void> {
    await this.page.locator(this.firstName).fill(first);
    await this.page.locator(this.lastName).fill(last);
    await this.page.locator(this.postal).fill(zip);
    await this.page.locator(this.continueButton).click();
  }

  async finish(): Promise<void> {
    await this.page.locator(this.finishButton).click();
  }

  async isComplete(): Promise<boolean> {
    await this.page.waitForURL(/checkout-complete\.html/, { timeout: 15000 });
    await this.page
      .getByRole("heading", { name: /thank you for your order!/i })
      .waitFor({ state: "visible", timeout: 15000 });
    return true;
  }
}
