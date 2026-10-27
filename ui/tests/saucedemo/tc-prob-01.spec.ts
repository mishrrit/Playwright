import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const prob = usersByKey.problem;

test("TC-PROB-01: problem_user - product data consistency checks", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  if (!prob) throw new Error("problem_user was not found");
  await login.login(prob.username, prob.password);
  const products = new ProductsPage(page);
  await expect(products.inventoryList).toBeVisible();

  // Verify product names and prices exist and are non-empty
  const count = await products.items.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < Math.min(5, count); i++) {
    const name = await products.productNameAt(i).innerText();
    const price = await products.productPriceAt(i).innerText();
    expect(name.length).toBeGreaterThan(0);
    expect(price).toMatch(/\$[0-9]+\.?[0-9]*/);
  }
});
