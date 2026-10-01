import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class CatalogPage extends BasePage {
  readonly booksHeading: Locator;
  readonly computingAndInternetProduct: Locator;
  readonly fictionProduct: Locator;

  constructor(page: Page) {
    super(page);
    this.booksHeading = page.getByRole("heading", { name: "Books" });
    this.computingAndInternetProduct = page.getByRole("link", {
      name: "Computing and Internet",
      exact: true,
    });
    this.fictionProduct = page.getByRole("link", {
      name: "Fiction",
      exact: true,
    });
  }

  async gotoBooks(): Promise<void> {
    await super.goto("/books");
  }
}
