---
title: "Restful Booker - Full API flow"
type: "api"
feature: "restful-booker"
author: "agent/playwright-orchestrator"
date: "2026-10-02"
scenarios:
  - id: 1
    title: "Create token"
  - id: 2
    title: "Get booking ids"
  - id: 3
    title: "Get booking by id"
  - id: 4
    title: "Create booking"
  - id: 5
    title: "Update booking"
  - id: 6
    title: "Partial update booking"
  - id: 7
    title: "Delete booking"
  - id: 8
    title: "Healthcheck"
---

# Plan: Restful Booker - Full API flow

Feature: restful-booker
Type: api
Author: agent/playwright-orchestrator
Date: 2026-10-02

## Overview

End-to-end API tests for Restful Booker covering auth, CRUD on bookings, and healthcheck.

## Run command

```bash
export API_BASE_URL=https://restful-booker.herokuapp.com
npx playwright test api/tests/booker --project=api --reporter=line,allure-playwright
```
