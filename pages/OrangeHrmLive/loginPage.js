const BasePage = require("./basePage");

class LoginPage extends BasePage{
    async navigate(url){
        await this.page.goto(url);
    }

    async login(username,password){
        await this.page.fill('[placeholder="Username"]', username);
        await this.page.fill('[placeholder="Password"]', password);
        await this.page.getByRole("button", { name: "Login" }).click();
    }

    async navigateTo(tabName) {
        await this.page.getByRole("link", { name: tabName }).click();
      }
}

module.exports = LoginPage;