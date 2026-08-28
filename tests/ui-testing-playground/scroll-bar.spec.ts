import { test } from '@playwright/test';
import { ScrollBarPage } from '../../pages/ui-testing-playground/ScrollBarPage';

test('ScrollBar: Test for scrolling to an element and clicking it', async ({ page }) => {
    const scrollBarPage = new ScrollBarPage(page);

    await scrollBarPage.goto();
    await scrollBarPage.navigateToScrollBar();
    await scrollBarPage.clickHidingButton();
    await scrollBarPage.verifyButtonVisible();
});
