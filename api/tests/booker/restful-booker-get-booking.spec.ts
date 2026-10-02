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

import { test, expect } from '@playwright/test';

const sampleBooking = {
  firstname: 'Agent',
  lastname: 'Getter',
  totalprice: 111,
  depositpaid: false,
  bookingdates: { checkin: '2026-10-01', checkout: '2026-10-02' },
  additionalneeds: 'None'
};

test('Get booking by id - create then GET /booking/:id', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const createResp = await request.post(`${base}/booking`, { data: sampleBooking });
  expect(createResp.status()).toBe(200);
  const created = await createResp.json();
  const id = created.bookingid;

  const resp = await request.get(`${base}/booking/${id}`);
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(body.firstname).toBe(sampleBooking.firstname);
  // cleanup
  await request.delete(`${base}/booking/${id}`);
});
