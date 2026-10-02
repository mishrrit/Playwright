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

import { test, expect } from '@playwright/test';

const initialBooking = {
  firstname: 'Agent',
  lastname: 'Updater',
  totalprice: 222,
  depositpaid: false,
  bookingdates: { checkin: '2026-10-01', checkout: '2026-10-02' },
  additionalneeds: 'None'
};

const updatedBooking = {
  firstname: 'Agent',
  lastname: 'Updater-Edited',
  totalprice: 333,
  depositpaid: true,
  bookingdates: { checkin: '2026-10-05', checkout: '2026-10-06' },
  additionalneeds: 'Lunch'
};

async function getAuthToken(request) {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const r = await request.post(`${base}/auth`, { data: { username: 'admin', password: 'password123' } });
  const b = await r.json();
  return b.token;
}

test('Update booking - PUT /booking/:id', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const createResp = await request.post(`${base}/booking`, { data: initialBooking });
  expect(createResp.status()).toBe(200);
  const created = await createResp.json();
  const id = created.bookingid;

  const token = await getAuthToken(request);
  const resp = await request.put(`${base}/booking/${id}`, {
    data: updatedBooking,
    headers: { Cookie: `token=${token}` },
  });

  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(body.lastname).toBe(updatedBooking.lastname);

  // cleanup
  await request.delete(`${base}/booking/${id}`, { headers: { Cookie: `token=${token}` } });
});
