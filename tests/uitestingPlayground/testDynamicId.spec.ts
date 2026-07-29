import { test, expect } from 'playwright/test';


test.describe('test for elements', async () => {

    test('Record buttomn click', async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
        await page.getByRole('link', { name: 'Dynamic ID' }).click();
        await page.getByRole('button', { name: 'Button with Dynamic ID' }).click();
        await expect(page.getByRole('button', { name: 'Button with Dynamic ID' })).toBeVisible();
    });

    test('Record primary (blue) button click and press ok in alert popup', async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
        await page.getByRole('link', { name: 'Class Attribute' }).click();

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Primary button pressed');
            await page.waitForTimeout(1000);
            await dialog.accept();
        });

        await page.locator('button.btn-primary').click({ timeout: 15000 });
        await page.waitForTimeout(1000);
    });
});