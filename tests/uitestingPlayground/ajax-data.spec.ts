import { test } from 'playwright/test';
import { AjaxDataPage } from '../../pages/uiTestingPlayground/AjaxDataPage';

test('AJAX Data: Test for text visibility after clicking a button', async ({ page }) => {
    const ajaxDataPage = new AjaxDataPage(page);

    await ajaxDataPage.goto();
    await ajaxDataPage.navigateToAjaxData();
    await ajaxDataPage.clickAjaxButton();
    await ajaxDataPage.verifyResponseVisible();
});
