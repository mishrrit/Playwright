import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const visual = users.find((u: any) => u.key === "visual");

test("TC-VIS-02: Product cards layout snapshot", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  if (!visual) throw new Error("Visual user not found");
  await login.login(visual.username, visual.password);
  await expect(page.locator(".inventory_list")).toBeVisible();
  // capture a screenshot for visual comparison (baseline not managed here)
  const shot = await page.screenshot({ fullPage: false });
  test.info().attachments.push({
    name: "products-snapshot",
    body: shot,
    contentType: "image/png",
  });
  expect(shot.byteLength).toBeGreaterThan(1000);
});
