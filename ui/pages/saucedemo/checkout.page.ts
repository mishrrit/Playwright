import { Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class CheckoutPage extends BasePage {
  readonly firstName = "#first-name";
  readonly lastName = "#last-name";
  readonly postal = "#postal-code";
  readonly continueButton = "#continue";
  readonly finishButton = "#finish";
  readonly completeHeader = "h2";

  constructor(page: Page) {
    super(page);
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.page.fill(this.firstName, first);
    await this.page.fill(this.lastName, last);
    await this.page.fill(this.postal, zip);
    await this.page.click(this.continueButton);
  }

  async finish() {
    await this.page.click(this.finishButton);
  }

  async isComplete() {
    await this.page.waitForURL(/checkout-complete\.html/, { timeout: 15000 });
    await this.page
      .getByRole("heading", { name: /thank you for your order!/i })
      .waitFor({ state: "visible", timeout: 15000 });
    return true;
  }
}
