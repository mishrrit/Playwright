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

import { test, expect } from '@playwright/test';

const sampleBooking = {
  firstname: 'Agent',
  lastname: 'Deleter',
  totalprice: 77,
  depositpaid: false,
  bookingdates: { checkin: '2026-10-01', checkout: '2026-10-02' },
  additionalneeds: 'None'
};

async function getAuthToken(request) {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const r = await request.post(`${base}/auth`, { data: { username: 'admin', password: 'password123' } });
  const b = await r.json();
  return b.token;
}

test('Delete booking - DELETE /booking/:id', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const createResp = await request.post(`${base}/booking`, { data: sampleBooking });
  expect(createResp.status()).toBe(200);
  const created = await createResp.json();
  const id = created.bookingid;

  const token = await getAuthToken(request);
  const delResp = await request.delete(`${base}/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  expect([201, 200, 204]).toContain(delResp.status());
});
