import { test as baseTest, expect } from "@playwright/test";

export type LoginFixture = {
  login: {
    username: string;
    password: string;
  };
};

export const test = baseTest.extend<LoginFixture>({
  login: async ({ page }, use) => {
    const credentials = {
      username: "Admin",
      password: "admin123",
    };

    await page.goto("/");
    await page.getByPlaceholder("Username").fill(credentials.username);
    await page.getByPlaceholder("Password").fill(credentials.password);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByRole("link", { name: "PIM" })).toBeVisible();

    await use(credentials);
  },
});
