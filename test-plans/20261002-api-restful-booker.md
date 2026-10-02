---
title: "Restful Booker - Basic booking list"
type: "api"
feature: "restful-booker"
author: "agent/playwright-orchestrator"
date: "2026-10-02"
scenarios:
  - id: 1
    title: "Get booking list"
    priority: "P1"
---

# Plan: Restful Booker - Basic booking list

Feature: restful-booker
Type: api
Author: agent/playwright-orchestrator
Date: 2026-10-02

## Overview

Verify the public booking list endpoint returns a JSON array of booking ids and responds with HTTP 200.

## Scenarios

- Scenario 1 (id: 1): GET /booking returns 200 and a list of booking objects with `bookingid`.

## Run command (example)

```bash
export API_BASE_URL=https://restful-booker.herokuapp.com
npx playwright test api/tests/booker/20261002-api-booker-get-bookings.spec.ts --project=api --reporter=line,allure-playwright
```

## Notes

- This plan targets the public restful-booker demo API. Use `API_BASE_URL` env var to point to the target environment.
- Generated artifacts will be placed under `api/tests/booker/` and `api/models/schemas/`.
