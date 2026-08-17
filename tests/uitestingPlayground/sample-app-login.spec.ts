import { test } from 'playwright/test';
import { SampleAppPage } from '../../pages/uiTestingPlayground/SampleAppPage';

test('Sample App: Login and verify success message', async ({ page }) => {
    const sampleAppPage = new SampleAppPage(page);

    await sampleAppPage.goto();
    await sampleAppPage.navigateToSampleApp();
    await sampleAppPage.login('testuser', 'pwd');
    await sampleAppPage.verifyLoginStatus('Welcome, testuser!');
});
