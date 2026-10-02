/*
{
  "id": "api-booker-auth-001",
  "suite": "booker",
  "title": "Create token",
  "priority": "P1",
  "tags": ["auth","booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

test("Create token - POST /auth", async ({ bookingService }) => {
  const { status, body } = await bookingService!.auth("admin", "password123");
  expect(status, "auth status").toBe(200);
  expect((body as any).token, "token present").toBeTruthy();
});
