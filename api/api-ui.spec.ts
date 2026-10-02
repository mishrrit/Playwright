import { test, expect } from "./fixtures/apiFixtures";
import { UserService } from "./services/UserService";
import { fakeUser } from "./utils/fakerFactory";
import { retry } from "./utils/retry";

// This test targets an app with /users endpoints; skip when running against Restful-Booker demo
if ((process.env.API_BASE_URL || "").includes("restful-booker")) {
  test.skip(true, "Skipped: API_BASE_URL is Restful-Booker demo");
}

test("API -> UI integration: create user via API, login via UI, verify via API", async ({
  apiRequest,
  page,
}) => {
  const userService = new UserService(apiRequest);
  const newUser = fakeUser();

  const createResp = await retry(
    () =>
      userService.create({
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.fullName,
      }),
    3,
    200,
    2000,
  );
  expect(createResp.status).toBe(201);
  const userId = (createResp.body as any).id;

  // UI: simple login flow - adjust selectors for your app
  await page.goto("/login");
  await page.fill("input[name=email]", newUser.email);
  await page.fill("input[name=password]", newUser.password);
  await page.click("button[type=submit]");
  await page.waitForSelector(".dashboard");

  const getResp = await userService.getById(userId);
  expect(getResp.status).toBe(200);
  expect((getResp.body as any).email).toBe(newUser.email);
});
