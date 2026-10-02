/*
{
  "id": "api-booker-002",
  "suite": "booker",
  "title": "Get booking ids",
  "priority": "P2",
  "tags": ["booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

test("Get booking ids - GET /booking", async ({ bookingService }) => {
  const { status, body } = await bookingService!.list();
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBeTruthy();
  if ((body as any).length > 0)
    expect((body as any)[0].hasOwnProperty("bookingid")).toBeTruthy();
});
