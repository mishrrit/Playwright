import { test } from '@playwright/test';
import { OverlappedElementPage } from '../../pages/ui-testing-playground/OverlappedElementPage';

test('Overlapped Element: Test for clicking an overlapped element', async ({ page }) => {
    const overlappedElementPage = new OverlappedElementPage(page);

    await overlappedElementPage.goto();
    await overlappedElementPage.navigateToOverlappedElement();
    await overlappedElementPage.fillIdField('test input');
    await overlappedElementPage.fillNameField('test name');
});
