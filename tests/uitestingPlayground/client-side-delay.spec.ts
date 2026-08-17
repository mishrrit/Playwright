import { test } from 'playwright/test';
import { ClientSideDelayPage } from '../../pages/uiTestingPlayground/ClientSideDelayPage';

test('Client Side Delay: Test for text visibility after clicking a button', async ({ page }) => {
    const clientSideDelayPage = new ClientSideDelayPage(page);

    await clientSideDelayPage.goto();
    await clientSideDelayPage.navigateToClientSideDelay();
    await clientSideDelayPage.clickClientButton();
    await clientSideDelayPage.verifyResultVisible();
});
