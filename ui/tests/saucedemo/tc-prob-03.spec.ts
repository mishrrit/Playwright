import { test, expect } from "../../support/fixtures/anonymous";
import { LoginPage } from "../../pages/saucedemo/LoginPage";
import { ProductsPage } from "../../pages/saucedemo/ProductsPage";
import { ProductDetailsPage } from "../../pages/saucedemo/ProductDetailsPage";
import { usersByKey } from "../../test-data/saucedemo/users";

const standard = usersByKey.standard;
if (!standard) {
  throw new Error('Test data user "standard" was not found');
}

test("TC-PROB-03: Product detail pages assert identity via name and price", async ({
  page,
}) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(standard.username, standard.password);
  const products = new ProductsPage(page);
  const name = (await products.productNameAt(0).innerText()).trim();
  const price = (await products.productPriceAt(0).innerText()).trim();
  await products.productNameAt(0).click();
  const details = new ProductDetailsPage(page);
  const detailName = (await details.name.innerText()).trim();
  const detailPrice = (await details.price.innerText()).trim();
  expect(detailName).toBe(name);
  expect(detailPrice).toBe(price);
});
