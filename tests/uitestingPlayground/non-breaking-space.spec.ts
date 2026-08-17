import { test } from 'playwright/test';
import { NonBreakingSpacePage } from '../../pages/uiTestingPlayground/NonBreakingSpacePage';

test('Non-Breaking Space: Test for text visibility with non-breaking spaces', async ({ page }) => {
    const nonBreakingSpacePage = new NonBreakingSpacePage(page);

    await nonBreakingSpacePage.goto();
    await nonBreakingSpacePage.navigateToNonBreakingSpace();
    await nonBreakingSpacePage.verifyButtonVisible();
});
