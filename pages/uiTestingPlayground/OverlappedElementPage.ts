import { Locator } from 'playwright/test';
import { BasePage } from './BasePage';

export class OverlappedElementPage extends BasePage {
    readonly idInput: Locator = this.page.locator('#id');
    readonly nameInput: Locator = this.page.locator('#name');

    async navigateToOverlappedElement() {
        await this.clickLink('Overlapped Element');
    }

    async fillIdField(value: string) {
        await this.idInput.fill(value);
    }

    async fillNameField(value: string) {
        await this.nameInput.fill(value);
    }
}
