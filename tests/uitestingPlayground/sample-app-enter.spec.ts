import { test } from 'playwright/test';
import { SampleAppPage } from '../../pages/uiTestingPlayground/SampleAppPage';

test('Sample App: Enter username and password', async ({ page }) => {
    const sampleAppPage = new SampleAppPage(page);

    await sampleAppPage.goto();
    await sampleAppPage.navigateToSampleApp();
    await sampleAppPage.enterUsername('testuser');
    await sampleAppPage.enterPassword('pwd');
});
