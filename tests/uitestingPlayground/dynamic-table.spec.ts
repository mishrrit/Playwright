import { test } from 'playwright/test';
import { DynamicTablePage } from '../../pages/uiTestingPlayground/DynamicTablePage';

test('Dynamic Table: Compare CPU values', async ({ page }) => {
    const dynamicTablePage = new DynamicTablePage(page);

    await dynamicTablePage.goto();
    await dynamicTablePage.navigateToDynamicTable();
    await dynamicTablePage.verifyTableCpuMatchesLabel();
});
