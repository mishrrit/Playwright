//@ts-check 
const { test, expect } = require("@playwright/test");
require("../pages/OrangeHrmLive/basePage");
require("../pages/OrangeHrmLive/commonHooks");
const LoginPage = require("../pages/OrangeHrmLive/loginPage");
//const Dashboard = require("../pages/OrangeHrmLive/DashBoard/dashBoard");
const PIMPage = require("../pages/OrangeHrmLive/DashBoard/pim/empInfoPage");
const AddEmployeePage = require("../pages/OrangeHrmLive/DashBoard/pim/addEmployeePage");


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
  //await pimPage.searchEmployee("Test", "Playwright");
  //await pimPage.deleteEmployee();
});
