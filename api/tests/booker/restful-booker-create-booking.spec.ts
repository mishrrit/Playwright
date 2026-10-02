/*
{
  "id": "api-booker-003",
  "suite": "booker",
  "title": "Create booking",
  "priority": "P1",
  "tags": ["booker","create","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

const sampleBooking = {
  firstname: "Agent",
  lastname: "Tester",
  totalprice: 123,
  depositpaid: false,
  bookingdates: { checkin: "2026-10-01", checkout: "2026-10-02" },
  additionalneeds: "Breakfast",
};

test("Create booking - POST /booking", async ({ bookingService }) => {
  const { status, body } = await bookingService!.create(sampleBooking);
  expect(status).toBe(200);
  expect(body as any).toHaveProperty("bookingid");
  expect(body as any).toHaveProperty("booking");
});
