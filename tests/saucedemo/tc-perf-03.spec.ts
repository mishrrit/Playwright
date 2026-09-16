import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import { CheckoutPage } from "../../pages/saucedemo/checkout.page";
import usersData from "../../test-data/saucedemo/saucedemo_users.json";
const users = Object.fromEntries((usersData as any[]).map((u: any) => [u.key, u]));

test("TC-PERF-03: Checkout flow under slow conditions -> eventual success", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(users.perf.username, users.perf.password);
  await products.addByName(
    await page.locator(products.productNames).nth(0).innerText(),
  );
  await page.click(".shopping_cart_link");
  await page.click("#checkout");
  await checkout.fillInfo("Perf", "User", "99999");
  await checkout.finish();
  expect(await checkout.isComplete()).toBeTruthy();
});
