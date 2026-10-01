import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { CartPage } from "../../pages/saucedemo/CartPage";
import users from "../../test-data/saucedemo/users.json";

test.describe("SauceDemo - Users", () => {
  for (const u of users as Array<any>) {
    const username = u.username;
    const password = u.password;
    const expected = u.expected;

    test(`${username} - login flow`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();

      const start = Date.now();
      await login.login(username, password);
      const duration = Date.now() - start;

      const products = new ProductsPage(page);

      if (expected === "locked") {
        const err = await login.getErrorText();
        expect(err.toLowerCase()).toContain("locked");
        return;
      }

      if (expected === "performance") {
        // performance_glitch_user: allow slower responses but assert eventual products load
        await expect(page.locator(".inventory_list")).toBeVisible({
          timeout: 15000,
        });
        test.info().annotations.push({
          type: "note",
          description: `Login took ${duration}ms`,
        });
        expect(duration).toBeLessThan(15000);
        return;
      }

      if (expected === "visual") {
        // visual_user: capture a screenshot for visual inspection
        await expect(page.locator(".inventory_list")).toBeVisible();
        await page.screenshot({
          path: `test-results/saucedemo-${username}-products.png`,
          fullPage: true,
        });
        return;
      }

      if (expected === "either") {
        // error_user: either an error shown or products page loads
        const err = await login.getErrorText();
        if (err) {
          expect(err.length).toBeGreaterThan(0);
          return;
        }
        await expect(page.locator(".inventory_list")).toBeVisible({
          timeout: 10000,
        });
        return;
      }

      // default: success
      await expect(page.locator(".inventory_list")).toBeVisible({
        timeout: 10000,
      });

      // exercise add to cart and checkout basics
      const productsPage = new ProductsPage(page);
      const cart = new CartPage(page);

      // add first product
      const firstProductName = await page
        .locator(".inventory_item_name")
        .first()
        .innerText();
      await productsPage.addToCartByName(firstProductName);
      const count = await productsPage.getCartCount();
      expect(count).toBeGreaterThan(0);

      // open cart and ensure item is present
      await cart.gotoCart();
      await expect(page.locator(".cart_list")).toBeVisible();
      await expect(
        page.locator(".cart_item .inventory_item_name"),
      ).toContainText(firstProductName);
    });
  }
});
