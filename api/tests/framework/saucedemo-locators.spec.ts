import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const testDirectory = path.resolve(__dirname, "../../../ui/tests/saucedemo");
const specs = fs.readdirSync(testDirectory).filter((file) => /\.spec\.[jt]s$/.test(file));

const pageDirectory = path.resolve(__dirname, "../../../ui/pages/saucedemo");

test("SauceDemo pages have canonical class-named modules without re-export shims", () => {
  const files = fs.readdirSync(pageDirectory).filter((file) => file.endsWith(".ts"));
  expect(files).toEqual(expect.arrayContaining([
    "CartPage.ts", "CheckoutPage.ts", "LoginPage.ts", "ProductDetailsPage.ts", "ProductsPage.ts",
  ]));
  for (const file of files) {
    expect(file).toMatch(/^[A-Z][A-Za-z]*Page\.ts$/);
    const source = fs.readFileSync(path.join(pageDirectory, file), "utf8");
    expect(source).toContain(`export class ${path.basename(file, ".ts")} extends BasePage`);
  }
});

for (const file of specs) {
  test(`${file} keeps locator construction in SauceDemo page objects`, () => {
    const source = fs.readFileSync(path.join(testDirectory, file), "utf8");
    expect(source).not.toMatch(/saucedemo\/(?:cart|checkout|login|products)\.page/);
    expect(source).not.toMatch(/\.(?:locator|getBy\w+|\${1,2}(?:eval)?)\s*\(/);
    expect(source).not.toMatch(/\bpage\s*\.\s*(?:click|dblclick|fill|type|press|check|uncheck|setChecked|selectOption|hover|focus|dragAndDrop|waitForSelector|textContent|innerText|innerHTML|inputValue|getAttribute|isVisible|isHidden|isEnabled|isDisabled|isChecked|isEditable|setInputFiles)\s*\(/);
  });
}
