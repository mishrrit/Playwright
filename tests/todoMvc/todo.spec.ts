import { test, expect, type Page } from '@playwright/test';

//const TODO_APP_URL = 'https://demo.playwright.dev/todomvc/#/';

const todoItems = (page: Page) => page.locator('.todo-list li');

async function addTodo(page: Page, text: string) {
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(text);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
}

async function toggleTodo(page: Page, text: string) {
  await todoItems(page).filter({ hasText: text }).getByLabel('Toggle Todo').check();
}

async function assertVisibleTodoItems(page: Page, expectedTexts: string[]) {
  await expect(todoItems(page)).toHaveCount(expectedTexts.length);
  for (const text of expectedTexts) {
    await expect(todoItems(page).filter({ hasText: text })).toBeVisible();
  }
}

async function clickFilter(page: Page, name: string) {
  await page.getByRole('link', { name }).click();
}

async function clearCompleted(page: Page) {
  await page.getByRole('button', { name: 'Clear completed' }).click();
}

test.describe('TodoMVC basic operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('todomvc/#/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('should add new todos', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read book');
    await addTodo(page, 'Pay bills');

    await assertVisibleTodoItems(page, ['Buy groceries', 'Read book', 'Pay bills']);
    await expect(page.locator('css=.todo-count')).toContainText('3');
  });

  test('should complete a todo and filter by status', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read book');

    await toggleTodo(page, 'Buy groceries');

    await clickFilter(page, 'Active');
    await assertVisibleTodoItems(page, ['Read book']);

    await clickFilter(page, 'Completed');
    await assertVisibleTodoItems(page, ['Buy groceries']);

    await clickFilter(page, 'All');
    await assertVisibleTodoItems(page, ['Buy groceries', 'Read book']);
  });

  test('should clear completed todos', async ({ page }) => {
    await addTodo(page, 'Buy groceries');
    await addTodo(page, 'Read book');

    await toggleTodo(page, 'Read book');
    await clearCompleted(page);

    await clickFilter(page, 'All');
    await assertVisibleTodoItems(page, ['Buy groceries']);
    await expect(page.locator('css=.todo-count')).toContainText('1');
    await expect(todoItems(page).filter({ hasText: 'Read book' })).toHaveCount(0);
  });
});
