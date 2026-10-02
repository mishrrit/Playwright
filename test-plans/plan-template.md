---
title: "Short descriptive title"
type: "ui"  # "ui" or "api"
feature: "authentication"
author: "your-name-or-agent"
date: "YYYY-MM-DD"
scenarios:
  - id: 1
    title: "User can log in"
    priority: "high"
---

# Plan: {{title}}

Feature: {{feature}}
Type: {{type}}
Author: {{author}}
Date: {{date}}

## Overview

Brief description of the feature and scope.

## Scenarios

- Scenario 1 (id: 1): User can log in — describe steps, expected results, preconditions, and test data.

## Run command (example)

- UI plan example:

```bash
# replace <project> with the Playwright project listed in playwright.config.ts
npx playwright test ui/tests/<suite>/YYYYMMDD-ui-<suite>-<short-desc>.spec.ts --project=ui-testing-playground-chromium --reporter=line,allure-playwright
```

- API plan example:

```bash
npx playwright test api/tests/<suite>/YYYYMMDD-api-<suite>-<short-desc>.spec.ts --project=api --reporter=line,allure-playwright
```

## Naming conventions

- Plan filename: `test-plans/YYYYMMDD-<type>-<feature>-<short-desc>.md`
- UI spec filename: `ui/tests/<suite>/YYYYMMDD-ui-<suite>-<short-desc>.spec.ts`
- API spec filename: `api/tests/<suite>/YYYYMMDD-api-<suite>-<short-desc>.spec.ts`

## Notes

- Ensure the `type` field matches `ui` or `api`. This determines where generated artifacts are placed.
- Include the recommended Playwright `project` name for CI runs in the plan body.
- Attach any related selectors, fixtures, or schemas created for the plan.
