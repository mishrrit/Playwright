# Negative: get non-existent id returns 404

**Status:** failed

## Summary

```text
Test: Negative: get non-existent id returns 404
Error: Error: [2mexpect([22m[31mreceived[39m[2m).[22mrejects[2m.[22mtoHaveProperty[2m([22m[32mpath[39m[2m, [22m[32mvalue[39m[2m)[22m

Expected path: [32m"status"[39m
Received path: [31m[][39m

Expected value: [32m404[39m
Received value: [31m[Error: apiRequestContext.get: getaddrinfo ENOTFOUND api.dev.example.com[39m
[31mCall log:[39m
[31m[2m  - → GET https://api.dev.example.com/api/v1/Books/999999999[22m[39m
[31m[2m    - user-agent: Playwright/1.62.1 (x64; windows 10.0) node/26.8[22m[39m
[31m[2m    - accept: application/json[22m[39m
[31m[2m    - accept-encoding: gzip,deflate,br[22m[39m
[31m[2m    - Content-Type: application/json[22m[39m
[31m][39m
Top stack: Error: [2mexpect([22m[31mreceived[39m[2m).[22mrejects[2m.[22mtoHaveProperty[2m([22m[32mpath[39m[2m, [22m[32mvalue[39m[2m)[22m
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-books.s-4dfee-non-existent-id-returns-404-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-books.s-4dfee-non-existent-id-returns-404-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.