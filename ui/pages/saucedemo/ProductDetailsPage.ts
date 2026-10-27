import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class ProductDetailsPage extends BasePage {
  readonly name: Locator;
  readonly price: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.locator(".inventory_details_name");
    this.price = page.locator(".inventory_details_price");
    this.backButton = page.locator('button[name="back-to-products"], button:has-text("Back")');
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}
