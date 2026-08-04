import { test, expect } from 'playwright/test';

test.describe('test for elements', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://uitestingplayground.com/');
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('Dynamic Id: Record buttomn click', async ({ page }) => {

        await page.getByRole('link', { name: 'Dynamic ID' }).click();
        await page.getByRole('button', { name: 'Button with Dynamic ID' }).click();
        await expect(page.getByRole('button', { name: 'Button with Dynamic ID' })).toBeVisible();
    });

    test('Class Attribute: Record primary (blue) button click and press ok in alert popup', async ({ page }) => {

        await page.getByRole('link', { name: 'Class Attribute' }).click();

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Primary button pressed');
            await page.waitForTimeout(1000);
            await dialog.accept();
        });

        await page.locator('button.btn-primary').click({ timeout: 15000 });
    });

    test('Hidden Layers: Execute the test to make sure that green button can not be hit twice.', async ({ page }) => {

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
    })

    test('Test for page loading and element visibility', async ({ page }) => {

        await page.getByRole('link', { name: 'Load Delay' }).click();
        await expect(page.getByRole('button', { name: 'Button Appearing After Delay' })).toBeVisible({ timeout: 10000 });
    })

    test('AJAX Data:Test for text visibility after clicking a button', async ({ page }) => {

        await page.getByRole('link', { name: 'AJAX Data' }).click();
        await page.getByRole('button', { name: 'Button Triggering AJAX Request' }).click();
        await expect(page.getByText('Data loaded with AJAX get request.')).toBeVisible({ timeout: 16000 });
    })

    test('Client Side Delay: Test for text visibility after clicking a button', async ({ page }) => {

        await page.getByRole('link', { name: 'Client Side Delay' }).click();
        await page.getByRole('button', { name: 'Button Triggering Client Side Logic' }).click();
        await expect(page.getByText('Data calculated on the client side.')).toBeVisible({ timeout: 16000 });
    })

    test('Click: Event based click on DOM Event', async ({ page }) => {
        await page.getByRole('link', { name: 'Click', exact: true }).click();
        await page.getByRole('button', { name: 'Button That Ignores DOM Click Event' }).click();
        await expect(page.locator('.btn-success')).toBeEnabled();
    })

    test('Text Input: Entering text into an element and verifying the input', async ({ page }) => {
        await page.getByRole('link', { name: 'Text Input' }).click();
        const inputField = page.locator('#newButtonName');
        const inputText = 'Test Button Name';
        await inputField.fill(inputText);
        const buttonLabel = await page.locator('.btn-primary');
        buttonLabel.click();
        await expect(buttonLabel).toHaveText(inputText);
    })

    test('ScrollBar: Test for scrolling to an element and clicking it', async ({ page }) => {
        await page.getByRole('link', { name: 'Scrollbars' }).click();
        const button = page.locator('#hidingButton');
        await button.click();
        await expect(button).toBeVisible();
    })

});

