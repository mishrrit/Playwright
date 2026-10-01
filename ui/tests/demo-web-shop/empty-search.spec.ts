import { test, expect } from "../../support/fixtures/base";
import { HomePage } from "../../pages/demo-web-shop/HomePage";
import { SearchPage } from "../../pages/demo-web-shop/SearchPage";
import searchData from "../../test-data/demo-web-shop/search.json";

// spec: test-plans/01-demo-web-shop-catalog-and-validation.md
// seed: unavailable in this repository; follows existing @playwright/test conventions
test.describe("Demo Web Shop search validation", () => {
  test("Scenario 1.3: show a clear message for a no-match search @regression", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    await homePage.goto();
    await expect(homePage.searchBox).toBeVisible();
    await homePage.searchFor(searchData.noMatch.query);

    await expect(searchPage.keywordInput).toHaveValue(searchData.noMatch.query);
    await expect(searchPage.noResultsMessage).toHaveText(
      searchData.noMatch.noResultsMessage,
    );
    await expect(searchPage.laptopProduct).toHaveCount(0);
  });
});
