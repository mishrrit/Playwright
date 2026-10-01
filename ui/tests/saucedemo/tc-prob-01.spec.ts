import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const prob = users.find((u: any) => u.username === "problem_user");

test("TC-PROB-01: problem_user - product data consistency checks", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  if (!prob) throw new Error("problem_user was not found");
  await login.login(prob.username, prob.password);
  await expect(page.locator(".inventory_list")).toBeVisible();

  // Verify product names and prices exist and are non-empty
  const items = page.locator(".inventory_item");
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < Math.min(5, count); i++) {
    const name = await items.nth(i).locator(".inventory_item_name").innerText();
    const price = await items
      .nth(i)
      .locator(".inventory_item_price")
      .innerText();
    expect(name.length).toBeGreaterThan(0);
    expect(price).toMatch(/\$[0-9]+\.?[0-9]*/);
  }
});
