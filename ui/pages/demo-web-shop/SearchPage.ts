import { Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export class SearchPage extends BasePage {
  readonly searchHeading: Locator;
  readonly keywordInput: Locator;
  readonly laptopProduct: Locator;
  readonly noResultsMessage: Locator;
  readonly sortBy: Locator;

  constructor(page: Page) {
    super(page);
    this.searchHeading = page.getByRole("heading", { name: "Search" });
    this.keywordInput = page.getByRole("textbox", {
      name: "Search keyword:",
    });
    this.laptopProduct = page.getByRole("link", {
      name: "14.1-inch Laptop",
      exact: true,
    });
    this.noResultsMessage = page.getByText(
      "No products were found that matched your criteria.",
    );
    this.sortBy = page.getByRole("combobox").nth(1);
  }

  async selectSortOrder(label: string): Promise<void> {
    await this.sortBy.selectOption({ label });
  }
}
