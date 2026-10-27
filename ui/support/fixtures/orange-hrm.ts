import { test as baseTest, expect } from "@playwright/test";
import { orangeHrmCredentials } from "../storage-state/prepare";

export type LoginFixture = {
  login: {
    username: string;
    password: string;
  };
};

export const test = baseTest.extend<LoginFixture>({
  login: async ({ page }, use) => {
    const credentials = orangeHrmCredentials();

    await page.goto("/web/index.php/dashboard/index");
    await expect(page.getByRole("link", { name: "PIM" })).toBeVisible();

    await use(credentials);
  },
});
