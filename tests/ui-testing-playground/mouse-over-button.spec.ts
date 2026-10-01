import { test } from "../../support/fixtures/base";
import { MouseOverPage } from '../../pages/ui-testing-playground/MouseOverPage';

test('Mouse Over: Hover and click button twice', async ({ page }) => {
    const mouseOverPage = new MouseOverPage(page);

    await mouseOverPage.goto();
    await mouseOverPage.navigateToMouseOver();
    await mouseOverPage.hoverAndClickButton(2);
    await mouseOverPage.verifyClickButtonCount('2');
});
