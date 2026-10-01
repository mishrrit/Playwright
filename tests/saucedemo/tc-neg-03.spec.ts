import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";

test("TC-NEG-03: Injection strings as credentials -> sanitized and error shown", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  const inj = "' OR '1'='1";
  await login.login(inj, inj);

  const err = await page.locator('[data-test="error"]').innerText();
  expect(err.length).toBeGreaterThan(0);
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page).toHaveURL(/saucedemo\.com/);
});
