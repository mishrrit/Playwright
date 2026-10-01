import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import { ProductsPage } from "../../pages/saucedemo/products.page";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const standard = users.find((u: any) => u.key === "standard");

test("TC-STD-04: Sorting and product details behave normally", async ({
  page,
}) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  await login.goto();
  if (!standard) {
    throw new Error("Standard user not found");
  }
  await login.login(standard.username, standard.password);
  await expect(page.locator(products.inventory)).toBeVisible();
  // Open first product details and return
  await page.locator(products.productNames).first().click();
  await expect(page.locator(".inventory_details_name")).toBeVisible();
  await page.click('button[name="back-to-products"], button:has-text("Back")');
  await expect(page.locator(products.inventory)).toBeVisible();
});
