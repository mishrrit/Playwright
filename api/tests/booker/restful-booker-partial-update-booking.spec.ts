/*
{
  "id": "api-booker-006",
  "suite": "booker",
  "title": "Partial update booking",
  "priority": "P2",
  "tags": ["booker","patch","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from "../../fixtures/apiFixtures";

const initialBooking = {
  firstname: "Agent",
  lastname: "Patcher",
  totalprice: 50,
  depositpaid: false,
  bookingdates: { checkin: "2026-10-01", checkout: "2026-10-02" },
  additionalneeds: "None",
};

async function getAuthToken(svc) {
  const { status, body } = await svc.auth("admin", "password123");
  if (status !== 200) throw new Error("auth failed");
  return (body as any).token;
}

test("Partial update booking - PATCH /booking/:id", async ({
  bookingService,
}) => {
  const { status: createStatus, body: created } =
    await bookingService!.create(initialBooking);
  expect(createStatus).toBe(200);
  const id = (created as any).bookingid;

  const token = await getAuthToken(bookingService!);
  const { status: patchStatus, body } = await bookingService!.partialUpdate(
    id,
    { firstname: "Agent-Patched" },
    token,
  );

  expect(patchStatus).toBe(200);
  expect((body as any).firstname).toBe("Agent-Patched");

  // cleanup
  await bookingService!.delete(id, token);
});
