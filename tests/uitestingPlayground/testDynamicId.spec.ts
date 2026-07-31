import { test, expect } from 'playwright/test';


test.describe('test for elements', async () => {

    test('Record buttomn click', async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
        await page.getByRole('link', { name: 'Dynamic ID' }).click();
        await page.getByRole('button', { name: 'Button with Dynamic ID' }).click();
        await expect(page.getByRole('button', { name: 'Button with Dynamic ID' })).toBeVisible();
        await page.close();
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
        await page.close();
    });

    test('Execute the test to make sure that green button can not be hit twice.', async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
        await page.getByRole('link', { name: 'Hidden Layers' }).click();
        const greenButton = page.locator('#greenButton');

        await greenButton.click();

        await expect(greenButton).toBeEnabled();

        // Check if Playwright considers it actionable/clickable
        let clickable = true;

        try {
            await greenButton.click({
                trial: true, // checks actionability without actually clicking
                timeout: 3000
            });
        } catch {
            clickable = false;
        }

        expect(clickable).toBeFalsy();

        await page.close();
    })

    test('Test for page loading and element visibility', async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
        await page.getByRole('link', { name: 'Load Delay' }).click();
        await expect(page.getByRole('button', { name: 'Button Appearing After Delay' })).toBeVisible({ timeout: 10000 });
        await page.close();
    })

    test('Test for text visibility after clicking a button', async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
        await page.getByRole('link', { name: 'AJAX Data' }).click();
        await page.getByRole('button', { name: 'Button Triggering AJAX Request' }).click();
        await expect(page.getByText('Data loaded with AJAX get request.')).toBeVisible({ timeout: 10000 });
        await page.close();
    })



});

