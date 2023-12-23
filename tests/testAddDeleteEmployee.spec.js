const { test, expect } = require("@playwright/test");
require("../pages/basePage");
require("../pages/commonHooks");
const LoginPage = require("../pages/LoginPage");
//const Dashboard = require("../pages/DashBoard/dashBoard");
const PIMPage = require("../pages/DashBoard/pim/empInfoPage");
const AddEmployeePage = require("../pages/DashBoard/pim/addEmployeePage");

test("Add Employee", async ({ page }) => {
  const loginPage = new LoginPage(page);
  //const dashboardPage = new Dashboard(page);
  const pimPage = new PIMPage(page);
  const addEmployeePage = new AddEmployeePage(page);
  await loginPage.login("Admin", "admin123");
  await loginPage.navigateTo("PIM");
  await pimPage.navigateToAddEmployee();
  await addEmployeePage.addEmployee("Test", "Playwright");
  await loginPage.navigateTo("PIM");
  await pimPage.deleteEmployee("Test", "Playwright");
});
