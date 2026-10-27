import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class CartPage extends BasePage {
  readonly cartList: Locator;
  readonly checkoutButton: Locator;
  readonly cartLink: Locator;
  readonly title: Locator;
  readonly items: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator(".cart_list");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartLink = page.locator(".shopping_cart_link");
    this.title = page.locator(".title");
    this.items = page.locator(".cart_item");
    this.productNames = this.items.locator(".inventory_item_name");
  }

  async gotoCart(): Promise<void> {
    await this.cartLink.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.cartList.isVisible();
  }
}
