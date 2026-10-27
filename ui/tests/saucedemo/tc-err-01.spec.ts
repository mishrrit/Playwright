import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const errUser = usersByKey.error;

test("TC-ERR-01: error_user - resilient error handling", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(errUser.username, errUser.password);

  const products = new ProductsPage(page);
  const isOnProductsPage = await products.inventoryList.isVisible();
  const hasError = await login.errorContainer.count();

  expect(isOnProductsPage || hasError > 0).toBeTruthy();
  if (isOnProductsPage) {
    await expect(products.inventoryList).toBeVisible();
  } else {
    await expect(login.errorContainer).not.toHaveText("");
  }
});
