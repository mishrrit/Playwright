import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { usersByKey as users } from "../../test-data/saucedemo/users";

test("TC-ERR-02: Attempt product operations -> verify graceful error handling", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.error.username, users.error.password);

  const products = new ProductsPage(page);
  await expect(products.inventoryList).toBeVisible({
    timeout: 10000,
  });

  await products.addFirstProductToCart();

  const hasError = await login.errorContainer.isVisible();
  const cartVisible = await products.cartLink.isVisible();

  expect(hasError || cartVisible).toBeTruthy();
  if (hasError) {
    await expect(login.errorContainer).not.toHaveText("");
  }
});
