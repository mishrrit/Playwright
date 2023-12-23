const BasePage = require("../basePage");

class DashboardPage extends BasePage {
  async navigateTo(tabName) {
    await this.page.getByRole("link", { name: tabName }).click();
  }
}

module.export = DashboardPage;