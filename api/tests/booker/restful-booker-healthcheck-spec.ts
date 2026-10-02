/*
{
  "id": "api-booker-008",
  "suite": "booker",
  "title": "Healthcheck",
  "priority": "P3",
  "tags": ["health","booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from '@playwright/test';

test('Healthcheck - GET /ping', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const resp = await request.get(`${base}/ping`);
  // docs indicate a 201 or 200; accept both
  expect([200, 201]).toContain(resp.status());
});
