import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class ProductsPage extends BasePage {
  readonly title: Locator;
  readonly inventory = ".inventory_list";
  readonly inventoryList: Locator;
  readonly productNames = ".inventory_item_name";
  readonly cartBadge = ".shopping_cart_badge";

  constructor(page: Page) {
    super(page);
    this.title = page.locator(".title");
    this.inventoryList = page.locator(this.inventory);
  }

  async isLoaded(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }

  async getTitleText(): Promise<string> {
    return (await this.title.innerText()).trim();
  }

  async addToCartByName(name: string) {
    const product = this.page
      .locator(".inventory_item")
      .filter({ hasText: name })
      .first();
    await product.locator("button").click();
  }

  async getCartCount(): Promise<number> {
    const count = await this.page
      .locator(this.cartBadge)
      .innerText()
      .catch(() => "0");
    return parseInt(count || "0", 10);
  }

  async isVisible(): Promise<boolean> {
    return this.inventoryList.isVisible();
  }

  async addByName(name: string): Promise<void> {
    await this.addToCartByName(name);
  }

  async cartCount(): Promise<number> {
    return this.getCartCount();
  }

  async openProductByName(name: string) {
    const product = this.page
      .locator(".inventory_item")
      .filter({ hasText: name })
      .first();
    await product.locator("a").first().click();
  }
}
