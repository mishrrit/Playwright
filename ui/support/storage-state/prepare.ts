import { expect, type Page } from "@playwright/test";
import { LoginPage as SauceDemoLoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { LoginPage as PracticeLoginPage } from "../../pages/practice-test-automation/LoginPage";
import { usersByKey } from "../../test-data/saucedemo/users";
import practiceLoginData from "../../test-data/practice-test-automation/login.json";
import type { StorageStateApp } from "./projects";

export function orangeHrmCredentials() {
  return {
    username: process.env.ORANGE_HRM_USERNAME || "Admin",
    password: process.env.ORANGE_HRM_PASSWORD || "admin123",
  };
}

export async function prepareStorageState(page: Page, app: StorageStateApp): Promise<void> {
  switch (app) {
    case "orange-hrm": {
      const credentials = orangeHrmCredentials();
      await page.goto("/web/index.php/auth/login");
      await page.getByPlaceholder("Username").fill(credentials.username);
      await page.getByPlaceholder("Password").fill(credentials.password);
      await page.getByRole("button", { name: "Login", exact: true }).click();
      await expect(page).toHaveURL(/\/dashboard\/index/);
      await expect(page.getByRole("link", { name: "PIM", exact: true })).toBeVisible();
      break;
    }
    case "saucedemo": {
      const login = new SauceDemoLoginPage(page);
      await login.goto();
      await login.login(usersByKey.standard.username, usersByKey.standard.password);
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(new ProductsPage(page).inventoryList).toBeVisible();
      break;
    }
    case "practice-test-automation": {
      const login = new PracticeLoginPage(page);
      await login.goto();
      await login.login(practiceLoginData.positiveLogin.username, practiceLoginData.positiveLogin.password);
      await expect(page).toHaveURL(new RegExp(practiceLoginData.positiveLogin.successUrlPattern));
      await expect(login.successMessage).toBeVisible();
      await expect(login.logoutLink).toBeVisible();
      break;
    }
    case "todo-mvc":
      await page.goto("/todomvc/");
      await expect(page.locator(".new-todo")).toBeVisible();
      break;
    case "ui-testing-playground":
    case "demo-web-shop":
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
      break;
    default:
      throw new Error(`Unsupported storage-state app: ${app}`);
  }
}
