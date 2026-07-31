import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Perform any global setup tasks here
    // For example: login, database setup, API initialization, etc.

    // Global navigation setup
    await page.goto('http://uitestingplayground.com/');

    await context.close();
    await browser.close();
}

export default globalSetup;
