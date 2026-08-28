import { test } from '@playwright/test';
import { ClassAttributePage } from '../../pages/ui-testing-playground/ClassAttributePage';

test('Class Attribute: Record primary (blue) button click and press ok in alert popup', async ({ page }) => {
    const classAttributePage = new ClassAttributePage(page);

    await classAttributePage.goto();
    await classAttributePage.navigateToClassAttribute();
    await classAttributePage.setupDialogHandler();
    await classAttributePage.clickPrimaryButton();
});
