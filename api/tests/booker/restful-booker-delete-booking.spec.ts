/*
{
  "id": "api-booker-007",
  "suite": "booker",
  "title": "Delete booking",
  "priority": "P2",
  "tags": ["booker","delete","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

const sampleBooking = {
  firstname: "Agent",
  lastname: "Deleter",
  totalprice: 77,
  depositpaid: false,
  bookingdates: { checkin: "2026-10-01", checkout: "2026-10-02" },
  additionalneeds: "None",
};

async function getAuthToken(svc) {
  const { status, body } = await svc.auth("admin", "password123");
  if (status !== 200) throw new Error("auth failed");
  return (body as any).token;
}

test("Delete booking - DELETE /booking/:id", async ({ bookingService }) => {
  const { status: createStatus, body: created } =
    await bookingService!.create(sampleBooking);
  expect(createStatus).toBe(200);
  const id = (created as any).bookingid;

  const token = await getAuthToken(bookingService!);
  const { status } = await bookingService!.delete(id, token);
  expect([201, 200, 204]).toContain(status);
});
