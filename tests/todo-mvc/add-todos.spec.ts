import { test, expect } from '@playwright/test';

test.describe('Add todos', () => {
  test('Add todos', async ({ page }) => {
    // Start on the TodoMVC home page
    await page.goto('todomvc/#/');

    // Enter 'Buy groceries' in the input field
    await page.locator('input.new-todo').fill('Buy groceries');

    // Press Enter after the first todo
    await page.keyboard.press('Enter');

    // Enter 'Read book' in the input field
    await page.locator('input.new-todo').fill('Read book');

    // Press Enter after the second todo
    await page.keyboard.press('Enter');

    // Enter 'Pay bills' in the input field
    await page.locator('input.new-todo').fill('Pay bills');

    // Press Enter after the third todo
    await page.keyboard.press('Enter');

    // Verify the first todo appears in the list
    await expect(page.getByText('Buy groceries')).toBeVisible();

    // Verify the second todo appears in the list
    await expect(page.getByText('Read book')).toBeVisible();

    // Verify the third todo appears in the list
    await expect(page.getByText('Pay bills')).toBeVisible();

    // Verify the todo count shows 3
    await expect(page.getByText('3')).toBeVisible();
  });
});
