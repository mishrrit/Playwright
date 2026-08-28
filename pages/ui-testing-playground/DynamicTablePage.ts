import { expect, Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class DynamicTablePage extends BasePage {
    readonly tableHeaders: Locator = this.page.locator('[role="columnheader"]');
    readonly warningLabel: Locator = this.page.locator('.bg-warning');

    async navigateToDynamicTable() {
        await this.clickLink('Dynamic Table');
    }

    async getCpuColumnIndex(): Promise<number> {
        const headerTexts = await this.tableHeaders.allInnerTexts();
        const cpuIndex = headerTexts.findIndex((text) => text.trim() === 'CPU');
        expect(cpuIndex).not.toBe(-1);
        return cpuIndex;
    }

    async getChromeRowCpuValue(cpuIndex: number): Promise<string> {
        const chromeRow = this.page.locator('[role="row"]', { hasText: 'Chrome' });
        const cells = chromeRow.locator('[role="cell"]');
        const cpuValue = await cells.nth(cpuIndex).innerText();
        return cpuValue.trim();
    }

    async getExpectedCpuValue(): Promise<string> {
        const labelText = await this.warningLabel.innerText();
        return labelText.replace('Chrome CPU:', '').trim();
    }

    async verifyTableCpuMatchesLabel() {
        const cpuIndex = await this.getCpuColumnIndex();
        const tableCpu = await this.getChromeRowCpuValue(cpuIndex);
        const expectedCpu = await this.getExpectedCpuValue();

        console.log(`Table CPU: ${tableCpu} | Label CPU: ${expectedCpu}`);
        expect(tableCpu).toBe(expectedCpu);
    }
}
