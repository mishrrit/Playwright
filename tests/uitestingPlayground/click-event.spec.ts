import { test } from 'playwright/test';
import { ClickEventPage } from '../../pages/uiTestingPlayground/ClickEventPage';

test('Click: Event based click on DOM Event', async ({ page }) => {
    const clickEventPage = new ClickEventPage(page);

    await clickEventPage.goto();
    await clickEventPage.navigateToClickEvent();
    await clickEventPage.clickIgnoreButton();
    await clickEventPage.verifySuccessButtonEnabled();
});
