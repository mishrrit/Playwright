/*
{
  "id": "api-booker-auth-001",
  "suite": "booker",
  "title": "Create token",
  "priority": "P1",
  "tags": ["auth","booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02"
}
*/

import { test, expect } from '@playwright/test';

test('Create token - POST /auth', async ({ request }) => {
  const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
  const resp = await request.post(`${base}/auth`, { data: { username: 'admin', password: 'password123' } });
  expect(resp.status(), 'auth status').toBe(200);
  const body = await resp.json();
  expect(body.token, 'token present').toBeTruthy();
});
