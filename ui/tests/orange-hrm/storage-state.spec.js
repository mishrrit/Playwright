//@ts-check
const { expect } = require("@playwright/test");
const { test } = require("../../support/fixtures/orange-hrm.ts");

test("Restores the authenticated dashboard without logging in again", async ({ page, login }) => {
  await expect(page).toHaveURL(/\/dashboard\/index/);
  await expect(page.getByRole("link", { name: "PIM", exact: true })).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toHaveCount(0);
});
