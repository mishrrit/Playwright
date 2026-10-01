import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class CartPage extends BasePage {
  readonly cartList: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator(".cart_list");
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async gotoCart(): Promise<void> {
    await this.page.locator(".shopping_cart_link").click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.cartList.isVisible();
  }
}
