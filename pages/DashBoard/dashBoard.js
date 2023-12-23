const BasePage = require("../basePage");

class Dashboard extends BasePage {
  async navigateTo(tabName) {
    await this.page.getByRole("link", { name: tabName }).click();
  }
}

module.export = Dashboard;