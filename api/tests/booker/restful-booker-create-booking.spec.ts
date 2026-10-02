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

import { test, expect } from '@playwright/test';

const sampleBooking = {
  firstname: 'Agent',
  lastname: 'Tester',
  totalprice: 123,
  depositpaid: false,
  bookingdates: { checkin: '2026-10-01', checkout: '2026-10-02' },
  additionalneeds: 'Breakfast'
};

test('Create booking - POST /booking', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const resp = await request.post(`${base}/booking`, { data: sampleBooking });
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(body).toHaveProperty('bookingid');
  expect(body).toHaveProperty('booking');
});
