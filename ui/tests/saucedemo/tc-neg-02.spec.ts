import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";

test("TC-NEG-02: Long username/password inputs -> app handles without crashing", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  const long = "a".repeat(2000);
  await login.login(long, long);

  await expect(page).toHaveURL(/saucedemo\.com/);
  await expect(login.errorContainer).toBeVisible();
  await expect(login.errorContainer).not.toHaveText("");
});
