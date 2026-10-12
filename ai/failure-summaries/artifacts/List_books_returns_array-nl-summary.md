# List books returns array

**Status:** failed

## Summary

```text
Test: List books returns array
Error: Error: apiRequestContext.get: getaddrinfo ENOTFOUND api.dev.example.com
Call log:
[2m  - → GET https://api.dev.example.com/api/v1/Books[22m
[2m    - user-agent: Playwright/1.62.1 (x64; windows 10.0) node/26.8[22m
[2m    - accept: application/json[22m
[2m    - accept-encoding: gzip,deflate,br[22m
[2m    - Content-Type: application/json[22m

Top stack: Error: apiRequestContext.get: getaddrinfo ENOTFOUND api.dev.example.com
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-books-F-7133d-ks-List-books-returns-array-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-books-F-7133d-ks-List-books-returns-array-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.