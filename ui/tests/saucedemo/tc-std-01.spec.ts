import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const standard = users.find((u: any) => u.key === "standard");
if (!standard) {
  throw new Error('Test data user "standard" was not found');
}

test("TC-STD-01: standard_user - login and checkout happy path", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(standard.username, standard.password);

  const products = new ProductsPage(page);
  await expect(page.locator(".inventory_list")).toBeVisible();
  expect(await products.getTitleText()).toBe("Products");

  // Add first product
  const firstName = await page
    .locator(".inventory_item_name")
    .first()
    .innerText();
  await products.addToCartByName(firstName);
  expect(await products.getCartCount()).toBe(1);

  // Verify cart contents and checkout
  const cart = new CartPage(page);
  await cart.gotoCart();
  await expect(page.locator(".cart_item .inventory_item_name")).toHaveText(
    firstName,
  );

  await cart.proceedToCheckout();
  // fill checkout info
  await page.fill('[data-test="firstName"]', "Test");
  await page.fill('[data-test="lastName"]', "User");
  await page.fill('[data-test="postalCode"]', "12345");
  await page.click('[data-test="continue"]');
  await page.click('[data-test="finish"]');

  await expect(page.locator(".complete-header")).toHaveText(
    /thank you for your order/i,
  );
});
