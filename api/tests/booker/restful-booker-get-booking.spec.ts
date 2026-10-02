/*
{
  "id": "api-booker-004",
  "suite": "booker",
  "title": "Get booking by id",
  "priority": "P2",
  "tags": ["booker","get","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

const sampleBooking = {
  firstname: "Agent",
  lastname: "Getter",
  totalprice: 111,
  depositpaid: false,
  bookingdates: { checkin: "2026-10-01", checkout: "2026-10-02" },
  additionalneeds: "None",
};

test("Get booking by id - create then GET /booking/:id", async ({
  bookingService,
}) => {
  const { status: createStatus, body: created } =
    await bookingService!.create(sampleBooking);
  expect(createStatus).toBe(200);
  const id = (created as any).bookingid;

  const { status, body } = await bookingService!.getById(id);
  expect(status).toBe(200);
  expect((body as any).firstname).toBe(sampleBooking.firstname);
  // cleanup (requires auth)
  const { status: authStatus, body: authBody } = await bookingService!.auth(
    "admin",
    "password123",
  );
  if (authStatus !== 200) throw new Error("auth failed for cleanup");
  const token = (authBody as any).token;
  await bookingService!.delete(id, token);
});
