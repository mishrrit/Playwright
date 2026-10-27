import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const vis = usersByKey.visual;

test("TC-VIS-01: visual_user - visual snapshot of Products page", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(vis!.username, vis!.password);

  const products = new ProductsPage(page);
  await expect(products.inventoryList).toBeVisible();
  await expect(products.items).toHaveCount(6);
  await expect(products.productNameAt(0)).toBeVisible();
  await expect(products.cartLink).toBeVisible();

  await page.screenshot({
    path: "test-results/saucedemo-visual-products.png",
    fullPage: true,
  });
});
