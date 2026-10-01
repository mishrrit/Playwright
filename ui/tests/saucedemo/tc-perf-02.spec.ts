import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import usersData from "../../test-data/saucedemo/saucedemo_users.json";
const users = Object.fromEntries((usersData as any[]).map((u: any) => [u.key, u]));

test("TC-PERF-02: Add to cart and navigate pages -> record response times", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.goto();
  const start = Date.now();
  await login.login(users.perf.username, users.perf.password);
  const loaded = Date.now();
  const loadTime = loaded - start;
  // Log timing for investigation; fail only if excessively slow > 10s
  test
    .info()
    .annotations.push({ type: "timing", description: `${loadTime}ms` });
  expect(loadTime).toBeLessThan(10000);
  await products.addByName(
    await page.locator(products.productNames).nth(0).innerText(),
  );
  await page.click(".shopping_cart_link");
  await expect(page.locator(".title")).toHaveText("Your Cart");
  await expect(page.locator(".cart_item")).toBeVisible();
});
