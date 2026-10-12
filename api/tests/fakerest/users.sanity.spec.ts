/*
{
  "id": "TC-USR-010",
  "location": "api/tests/fakerest/users.sanity.spec.ts",
  "category": "sanity",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { verifyResourceContract, expectValidationError } from "./contractAssertions";

const baseUser = {
  id: 0,
  userName: "tmp_user",
  password: "P@ssw0rd",
};

test.describe("Users sanity - CRUD and negative cases", () => {
  test("Non-persistent CRUD endpoint contracts", async ({ usersService }) => {
    await verifyResourceContract(usersService!, baseUser, { userName: "updated_user" });
  });

  test("Negative: create invalid user payload", async ({ usersService }) => {
    await expectValidationError(usersService!.create({ userName: 12345 }), "userName");
  });
});
