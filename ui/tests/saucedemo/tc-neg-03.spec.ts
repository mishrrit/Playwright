import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";

test("TC-NEG-03: Injection strings as credentials -> sanitized and error shown", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  const inj = "' OR '1'='1";
  await login.login(inj, inj);

  const err = await login.errorContainer.innerText();
  expect(err.length).toBeGreaterThan(0);
  await expect(login.errorContainer).toBeVisible();
  await expect(page).toHaveURL(/saucedemo\.com/);
});
