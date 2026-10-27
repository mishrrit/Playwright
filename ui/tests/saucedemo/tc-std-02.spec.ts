import { test, expect } from "../../support/fixtures/base";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";

test("TC-STD-02: Add multiple items to cart -> cart badge increments", async ({
  page,
}) => {
  const products = new ProductsPage(page);
  await page.goto("/inventory.html");
  await expect(products.inventoryList).toBeVisible();
  // Add first two items
  const first = await products.productNameAt(0).innerText();
  const second = await products.productNameAt(1).innerText();
  await products.addByName(first.trim());
  await products.addByName(second.trim());
  const count = await products.cartCount();
  expect(count).toBeGreaterThanOrEqual(2);
});
