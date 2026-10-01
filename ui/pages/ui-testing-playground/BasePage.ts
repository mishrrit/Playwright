import { Locator } from "playwright/test";
import { BasePage as SharedBasePage } from "../common/BasePage";

export class BasePage extends SharedBasePage {
  async goto(path: string = ""): Promise<void> {
    await super.goto(path || "/");
  }

  async waitForElement(locator: Locator, timeout = 10000): Promise<Locator> {
    await locator.waitFor({ state: "visible", timeout });
    return locator;
  }

  async getElementByDynamicText(
    text: string,
    timeout = 5000,
  ): Promise<Locator> {
    return this.waitForElement(
      this.page.getByText(text, { exact: false }),
      timeout,
    );
  }

  async clickLink(linkName: string): Promise<void> {
    await this.page.getByRole("link", { name: linkName }).click();
  }
}
