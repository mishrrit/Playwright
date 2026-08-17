import { test } from 'playwright/test';
import { ShadowDomPage } from '../../pages/uiTestingPlayground/ShadowDomPage';

test('Shadow DOM: Test for interacting with elements inside Shadow DOM', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const shadowDomPage = new ShadowDomPage(page);

    await shadowDomPage.goto();
    await shadowDomPage.navigateToShadowDom();
    await shadowDomPage.clickCogIcon();
    await shadowDomPage.copyToClipboard();
    await shadowDomPage.verifyClipboardMatchesEditField();
});
