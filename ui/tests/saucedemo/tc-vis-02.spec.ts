import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const visual = usersByKey.visual;

test("TC-VIS-02: Product cards layout snapshot", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  if (!visual) throw new Error("Visual user not found");
  await login.login(visual.username, visual.password);
  const products = new ProductsPage(page);
  await expect(products.inventoryList).toBeVisible();
  // capture a screenshot for visual comparison (baseline not managed here)
  const shot = await page.screenshot({ fullPage: false });
  test.info().attachments.push({
    name: "products-snapshot",
    body: shot,
    contentType: "image/png",
  });
  expect(shot.byteLength).toBeGreaterThan(1000);
});
