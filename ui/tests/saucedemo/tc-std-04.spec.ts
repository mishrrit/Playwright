import { test, expect } from "../../support/fixtures/base";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { ProductDetailsPage } from "../../pages/saucedemo/ProductDetailsPage";

test("TC-STD-04: Sorting and product details behave normally", async ({
  page,
}) => {
  const products = new ProductsPage(page);
  await page.goto("/inventory.html");
  await expect(products.inventoryList).toBeVisible();
  // Open first product details and return
  await products.productNameAt(0).click();
  const details = new ProductDetailsPage(page);
  await expect(details.name).toBeVisible();
  await details.backToProducts();
  await expect(products.inventoryList).toBeVisible();
});
