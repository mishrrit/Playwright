import { test } from 'playwright/test';
import { MouseOverPage } from '../../pages/uiTestingPlayground/MouseOverPage';

test('Mouse Over: Hover and click button twice', async ({ page }) => {
    const mouseOverPage = new MouseOverPage(page);

    await mouseOverPage.goto();
    await mouseOverPage.navigateToMouseOver();
    await mouseOverPage.hoverAndClickButton(2);
    await mouseOverPage.verifyClickButtonCount('2');
});
