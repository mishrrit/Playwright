/*
{
  "id": "api-booker-001",
  "suite": "booker",
  "title": "Get booking list",
  "priority": "P1",
  "tags": ["smoke","booker","api"],
  "author": "agent/playwright-orchestrator",
  "created": "2026-10-02",
  "contracts": ["../models/schemas/booking-list.schema.json"]
}
*/

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import bookingListSchema from '../../models/schemas/booking-list.schema.json';

const ajv = new Ajv();

test.describe('booker - booking list', () => {
  test('GET /booking returns a list of booking ids', async ({ request }) => {
    // Arrange
    const base = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';

    // Act
    const resp = await request.get(`${base}/booking`);

    // Assert
    expect(resp.status()).toBe(200);
    const body = await resp.json();
    const valid = ajv.validate(bookingListSchema, body);
    expect(valid, 'response should match booking-list schema').toBeTruthy();
  });
});
