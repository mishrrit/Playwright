import { test, expect } from "../../support/fixtures/base";
import { CatalogPage } from "../../pages/demo-web-shop/CatalogPage";
import { HomePage } from "../../pages/demo-web-shop/HomePage";

// spec: test-plans/01-demo-web-shop-catalog-and-validation.md
// seed: unavailable in this repository; follows existing @playwright/test conventions
test.describe("Demo Web Shop catalog", () => {
  test("Scenario 1.1: browse featured catalog and category @smoke @critical", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const catalogPage = new CatalogPage(page);

    await test.step("Open the site root", async () => {
      await homePage.goto();
      await expect(page).toHaveTitle("Demo Web Shop");
      await expect(homePage.welcomeHeading).toBeVisible();
    });

    await test.step("Open the Books category", async () => {
      await catalogPage.gotoBooks();
    });

    await test.step("Verify the Books product listing", async () => {
      await expect(page).toHaveURL(/\/books$/);
      await expect(catalogPage.booksHeading).toBeVisible();
      await expect(catalogPage.computingAndInternetProduct).toBeVisible();
      await expect(catalogPage.fictionProduct).toBeVisible();
    });
  });
});
