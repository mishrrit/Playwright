import { test } from 'playwright/test';
import { MouseOverPage } from '../../pages/uiTestingPlayground/MouseOverPage';

test('Mouse Over: Hover and click active link twice', async ({ page }) => {
    const mouseOverPage = new MouseOverPage(page);

    await mouseOverPage.goto();
    await mouseOverPage.navigateToMouseOver();
    await mouseOverPage.hoverAndClickLink(2);
    await mouseOverPage.verifyClickCount('2');
});
