# Users smoke: list and create-get-delete

**Status:** failed

## Summary

```text
Test: Users smoke: list and create-get-delete
Error: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-27bab63cc225fa43a9c9ea191f869148-8db448d35532d046-00"}
Top stack: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-27bab63cc225fa43a9c9ea191f869148-8db448d35532d046-00"}
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-users.s-17fba--list-and-create-get-delete-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-users.s-17fba--list-and-create-get-delete-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.