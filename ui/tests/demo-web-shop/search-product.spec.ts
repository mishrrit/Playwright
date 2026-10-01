import { test, expect } from "../../support/fixtures/base";
import { HomePage } from "../../pages/demo-web-shop/HomePage";
import { SearchPage } from "../../pages/demo-web-shop/SearchPage";
import searchData from "../../test-data/demo-web-shop/search.json";

// spec: test-plans/01-demo-web-shop-catalog-and-validation.md
// seed: unavailable in this repository; follows existing @playwright/test conventions
test.describe("Demo Web Shop product search", () => {
  test("Scenario 1.2: search for a known product and inspect sorting controls @smoke @regression", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    await test.step("Search for laptop", async () => {
      await homePage.goto();
      await expect(homePage.searchBox).toBeVisible();
      await homePage.searchFor(searchData.knownProduct.query);
    });

    await test.step("Verify the matching product", async () => {
      await expect(searchPage.searchHeading).toBeVisible();
      await expect(searchPage.keywordInput).toHaveValue(
        searchData.knownProduct.keyword,
      );
      await expect(searchPage.laptopProduct).toBeVisible();
    });

    await test.step("Change the sort order", async () => {
      await searchPage.selectSortOrder(searchData.knownProduct.sortLabel);
      await expect(searchPage.sortBy).toHaveValue(
        searchData.knownProduct.sortValue,
      );
      await expect(searchPage.laptopProduct).toBeVisible();
    });
  });
});
