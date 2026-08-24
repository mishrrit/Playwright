import { test as baseTest, Page } from "@playwright/test";

export type LoginFixture = {
  login: {
    username: string;
    password: string;
  };
};

export const test = baseTest.extend<LoginFixture>({
  login: async ({ page }: { page: Page }, use) => {
    const credentials = {
      username: "Admin",
      password: "admin123",
    };

    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
    await page.fill("#username", credentials.username);
    await page.fill("#password", credentials.password);
    await page.click("#login-button");

    await use(credentials);
  },
});
