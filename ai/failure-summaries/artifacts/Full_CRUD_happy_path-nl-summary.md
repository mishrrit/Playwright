# Full CRUD happy path

**Status:** failed

## Summary

```text
Test: Full CRUD happy path
Error: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-b59a419014d808458ebc4ad9692f74a7-4ecae03e61390c44-00"}
Top stack: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-b59a419014d808458ebc4ad9692f74a7-4ecae03e61390c44-00"}
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-users.s-834f3--cases-Full-CRUD-happy-path-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-users.s-834f3--cases-Full-CRUD-happy-path-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.