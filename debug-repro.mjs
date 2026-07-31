import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();
page.on('dialog', async dialog => {
    console.log('DIALOG', dialog.message());
    await dialog.dismiss();
});
page.on('console', msg => console.log('CONSOLE', msg.type(), msg.text()));
page.on('pageerror', err => console.log('PAGEERROR', err.message));
await page.goto('http://uitestingplayground.com/', { waitUntil: 'domcontentloaded' });
await page.getByRole('link', { name: 'Class Attribute' }).click();
console.log('URL after click', page.url());
const button = page.locator('button.btn-primary');
console.log('button count', await button.count());
console.log('button text', await button.textContent());
await button.click({ timeout: 10000 });
await page.waitForTimeout(2000);
await browser.close();
