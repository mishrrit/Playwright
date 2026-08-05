import { test as baseTest, Page } from '@playwright/test';


type LoginFixture = {
    login: {
        username: string;
        password: string;
    };
};

export const test = baseTest.extend<LoginFixture>({
    login: async ({ page }: { page: Page }, use) => {
        // Perform login steps here
        await page.goto('https://example.com/login');
        await page.fill('#username', 'your-username');
        await page.fill('#password', 'your-password');
        await page.click('#login-button');
        // Wait for navigation after login
        await page.waitForNavigation();
        // Use the logged-in page in tests
        //await use(page);
    }
});

export { LoginFixture };

