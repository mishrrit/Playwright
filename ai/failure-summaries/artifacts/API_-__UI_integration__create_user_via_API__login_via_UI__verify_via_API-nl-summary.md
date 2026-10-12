# API -> UI integration: create user via API, login via UI, verify via API

**Status:** failed

## Summary

```text
Test: API -> UI integration: create user via API, login via UI, verify via API
Error: Error: apiRequestContext.post: getaddrinfo ENOTFOUND api.dev.example.com
Call log:
[2m  - → POST https://api.dev.example.com/users[22m
[2m    - user-agent: Playwright/1.62.1 (x64; windows 10.0) node/26.8[22m
[2m    - accept: application/json; v=1.0[22m
[2m    - accept-encoding: gzip,deflate,br[22m
[2m    - Content-Type: application/json[22m
[2m    - content-length: 85[22m

Top stack: Error: apiRequestContext.post: getaddrinfo ENOTFOUND api.dev.example.com
Attachments: C:\projects\Playwright\test-results\api-api-ui-API---UI-integr-09e55-login-via-UI-verify-via-API-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-api-ui-API---UI-integr-09e55-login-via-UI-verify-via-API-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.