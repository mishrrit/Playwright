import { test as test } from '@playwright/test';

// test.only('Run only test', {
//     tag: '@fast',
// }, // This test will be run, and all other tests will be skipped with tag as fast
//     async ({ page }) => {
//         await page.goto('todomvc/#/');
//     });

test.skip('Skip this test', async ({ page }) => {
    await page.goto('todomvc/#/');
});

test('Skip conditionally', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'This test is skipped on Firefox');
    await page.goto('todomvc/#/');
});


test.describe('Annotations', () => {
    test('Test with annotations- 1', async ({ page }) => {
        await page.goto('todomvc/#/');
    });
    test('Test with annotations', async ({ page }) => {
        await page.goto('todomvc/#/');
    });
    test('Test with annotations- 3', async ({ page }) => {
        await page.goto('todomvc/#/');
    });
});


test('test', async ({ page }) => {
});