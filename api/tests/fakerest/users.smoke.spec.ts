/*
{
  "id": "TC-USER-001",
  "location": "api/tests/fakerest/users.smoke.spec.ts",
  "category": "smoke",
  "plan": "test-plans/fakerest-books-test-plan.md",
  "author": "agent/playwright-e2e-orchestrator",
  "created": "2026-10-08"
}
*/

import { test } from "../../fixtures/apiFixtures";
import { verifyResourceContract } from "./contractAssertions";

const sampleUser = {
  id: 0,
  userName: "smoke-user",
  password: "password123",
};

test("Users smoke: non-persistent list/create/get/delete contracts", async ({ usersService }) => {
  await verifyResourceContract(usersService!, sampleUser);
});
