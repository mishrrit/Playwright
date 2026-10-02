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

import { test, expect } from '@playwright/test';

const initialBooking = {
  firstname: 'Agent',
  lastname: 'Patcher',
  totalprice: 50,
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

test('Partial update booking - PATCH /booking/:id', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const createResp = await request.post(`${base}/booking`, { data: initialBooking });
  expect(createResp.status()).toBe(200);
  const created = await createResp.json();
  const id = created.bookingid;

  const token = await getAuthToken(request);
  const patchResp = await request.patch(`${base}/booking/${id}`, {
    data: { firstname: 'Agent-Patched' },
    headers: { Cookie: `token=${token}` },
  });

  expect(patchResp.status()).toBe(200);
  const body = await patchResp.json();
  expect(body.firstname).toBe('Agent-Patched');

  // cleanup
  await request.delete(`${base}/booking/${id}`, { headers: { Cookie: `token=${token}` } });
});
