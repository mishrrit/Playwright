/*
{
  "id": "api-booker-008",
  "suite": "booker",
  "title": "Healthcheck",
  "priority": "P3",
  "tags": ["health","booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

test("Healthcheck - GET /ping", async ({ bookingService }) => {
  const { status } = await bookingService!.ping();
  // docs indicate a 201 or 200; accept both
  expect([200, 201]).toContain(status);
});
