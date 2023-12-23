const BasePage = require("../../basePage");

class empInfoPage extends BasePage {

    async navigateToAddEmployee(){
        await this.page.getByRole("button", { name: "Add" }).click();
    }

    async searchEmployee(FirstName,LastName){{
        await this.page
            .getByRole("link",{ name:"Employee List" })
            .click();
        await this.page
            .getByPlaceholder("Type for hints...")
            .first()
            .fill(FirstName+" "+LastName);
        await this.page
            .getByRole("button",{ name:"Search" })
            .click();        
        }
    }

    async deleteEmployee(){
        await this.page
            .locator(".oxd-table-header-cell .oxd-checkbox-input-icon") 
            .click();
        await this.page
            .getByRole("button",{ name:"Delete Selected" })
            .click();
        await this.page
            .getByRole("button",{ name:" Yes, Delete " })
            .click();
    }
}

module.exports = empInfoPage;