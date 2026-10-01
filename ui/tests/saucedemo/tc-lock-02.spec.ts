import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/login.page";
import usersData from "../../test-data/saucedemo/saucedemo_users.json";
const users = Object.fromEntries(
  (usersData as any[]).map((u: any) => [u.key, u]),
);

test("TC-LOCK-02: Locked out user cannot proceed to checkout", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.locked.username, users.locked.password);
  const err = await page.locator('[data-test="error"]').innerText();
  expect(err.toLowerCase()).toContain("locked");
  // should remain on login page
  await expect(page).toHaveURL(/saucedemo\.com/);
});
