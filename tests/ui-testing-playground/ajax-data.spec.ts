import { test } from "../../support/fixtures/base";
import { AjaxDataPage } from '../../pages/ui-testing-playground/AjaxDataPage';

test('AJAX Data: Test for text visibility after clicking a button', async ({ page }) => {
    const ajaxDataPage = new AjaxDataPage(page);

    await ajaxDataPage.goto();
    await ajaxDataPage.navigateToAjaxData();
    await ajaxDataPage.clickAjaxButton();
    await ajaxDataPage.verifyResponseVisible();
});
