import { test, expect } from "../../support/fixtures/base";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const perf = usersByKey.perf;

test("TC-PERF-01: performance_glitch_user - measure login latency and resilience", async ({
  page,
}) => {
  if (!perf) {
    throw new Error("Performance user not found");
  }
  const login = new LoginPage(page);
  await login.goto();
  const start = Date.now();
  await login.login(perf.username, perf.password);

  await expect(page.locator(".inventory_list")).toBeVisible({ timeout: 20000 });

  const duration = Date.now() - start;
  test
    .info()
    .annotations.push({ type: "perf", description: `login_ms:${duration}` });
  expect(duration).toBeGreaterThan(0);
  expect(duration).toBeLessThan(20000);
});
