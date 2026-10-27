import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import { CheckoutPage } from "../../pages/saucedemo/CheckoutPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const standard = usersByKey.standard;
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
  await expect(products.inventoryList).toBeVisible();
  expect(await products.getTitleText()).toBe("Products");

  // Add first product
  const firstName = await products.productNameAt(0).innerText();
  await products.addToCartByName(firstName);
  expect(await products.getCartCount()).toBe(1);

  // Verify cart contents and checkout
  const cart = new CartPage(page);
  await cart.gotoCart();
  await expect(cart.productNames).toHaveText(firstName);

  await cart.proceedToCheckout();
  const checkout = new CheckoutPage(page);
  await checkout.fillInfo("Test", "User", "12345");
  await checkout.finish();

  await expect(checkout.completionMessage).toHaveText(
    /thank you for your order/i,
  );
});
