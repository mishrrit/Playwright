import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import users from "../../test-data/saucedemo/saucedemo_users.json";

const locked = users.find((u: any) => u.username === "locked_out_user");
if (!locked) {
  throw new Error("locked_out_user was not found in test data");
}

test("TC-LOCK-01: locked_out_user sees locked error and cannot proceed", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(locked.username, locked.password);
  const err = await login.getErrorText();
  expect(err.toLowerCase()).toContain("locked");
  await expect(page).toHaveURL(/saucedemo\.com/);
});
