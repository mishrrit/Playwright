/*
{
  "id": "api-booker-002",
  "suite": "booker",
  "title": "Get booking ids",
  "priority": "P2",
  "tags": ["booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from '@playwright/test';

test('Get booking ids - GET /booking', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const resp = await request.get(`${base}/booking`);
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(Array.isArray(body)).toBeTruthy();
  if (body.length > 0) expect(body[0].hasOwnProperty('bookingid')).toBeTruthy();
});
