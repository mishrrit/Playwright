//@ts-check
const { test } = require("../fixtures/orange-hrm.ts");
const LoginPage = require("../../pages/orange-hrm/loginPage");
const PIMPage = require("../../pages/orange-hrm/dashboard/pim/EmployeeInfoPage");
const AddEmployeePage = require("../../pages/orange-hrm/dashboard/pim/AddEmployeePage");

test("Add Employee", async ({ page, login }) => {
  const loginPage = new LoginPage(page);
  //const dashboardPage = new Dashboard(page);
  const pimPage = new PIMPage(page);
  const addEmployeePage = new AddEmployeePage(page);

  await loginPage.navigateTo("PIM");
  await pimPage.navigateToAddEmployee();
  await addEmployeePage.addEmployee("Test", "Playwright");
  await loginPage.navigateTo("PIM");
});
