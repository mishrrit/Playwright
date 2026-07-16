import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('pt1 class');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('revesion');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('reverse ');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await page.getByRole('listitem').filter({ hasText: 'pt1 class' }).getByLabel('Toggle Todo').check();
    await page.getByRole('listitem').filter({ hasText: 'revesion' }).getByLabel('Toggle Todo').check();
    await page.getByRole('listitem').filter({ hasText: 'reverse' }).getByLabel('Toggle Todo').check();
    await page.getByRole('link', { name: 'Completed' }).click();
    await page.getByRole('button', { name: 'Clear completed' }).click();
});