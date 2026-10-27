import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class ProductsPage extends BasePage {
  readonly title: Locator;
  readonly inventory = ".inventory_list";
  readonly inventoryList: Locator;
  readonly productNames = ".inventory_item_name";
  readonly cartBadge = ".shopping_cart_badge";
  readonly items: Locator;
  readonly cartLink: Locator;
  readonly inventoryButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator(".title");
    this.inventoryList = page.locator(this.inventory);
    this.items = page.locator(".inventory_item");
    this.cartLink = page.locator(".shopping_cart_link");
    this.inventoryButtons = this.items.locator(".btn_inventory");
  }

  productNameAt(index: number): Locator {
    return this.items.nth(index).locator(this.productNames);
  }

  productPriceAt(index: number): Locator {
    return this.items.nth(index).locator(".inventory_item_price");
  }

  async addFirstProductToCart(): Promise<void> {
    await this.inventoryButtons.first().click();
  }

  async isLoaded(): Promise<boolean> {
    return this.isVisible();
  }

  async getTitleText(): Promise<string> {
    return (await this.title.innerText()).trim();
  }

  private productByName(name: string): Locator {
    return this.items.filter({ hasText: name }).first();
  }

  async addToCartByName(name: string): Promise<void> {
    await this.productByName(name).locator("button").click();
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

  async openProductByName(name: string): Promise<void> {
    await this.productByName(name).locator("a").first().click();
  }
}
