import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const locked = usersByKey.locked;
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
