/*
{
  "id": "api-booker-005",
  "suite": "booker",
  "title": "Update booking",
  "priority": "P2",
  "tags": ["booker","update","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

const initialBooking = {
  firstname: "Agent",
  lastname: "Updater",
  totalprice: 222,
  depositpaid: false,
  bookingdates: { checkin: "2026-10-01", checkout: "2026-10-02" },
  additionalneeds: "None",
};

const updatedBooking = {
  firstname: "Agent",
  lastname: "Updater-Edited",
  totalprice: 333,
  depositpaid: true,
  bookingdates: { checkin: "2026-10-05", checkout: "2026-10-06" },
  additionalneeds: "Lunch",
};

async function getAuthToken(svc) {
  const { status, body } = await svc.auth("admin", "password123");
  if (status !== 200) throw new Error("auth failed");
  return (body as any).token;
}

test("Update booking - PUT /booking/:id", async ({ bookingService }) => {
  const { status: createStatus, body: created } =
    await bookingService!.create(initialBooking);
  expect(createStatus).toBe(200);
  const id = (created as any).bookingid;

  const token = await getAuthToken(bookingService!);
  const { status, body } = await bookingService!.update(
    id,
    updatedBooking,
    token,
  );

  expect(status).toBe(200);
  expect((body as any).lastname).toBe(updatedBooking.lastname);

  // cleanup
  await bookingService!.delete(id, token);
});
