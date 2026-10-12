# Create -> Get -> Update -> Delete lifecycle

**Status:** failed

## Summary

```text
Test: Create -> Get -> Update -> Delete lifecycle
Error: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-e4a239ba34f85a499da941cd3eb8c5da-f82bae736d920648-00"}
Top stack: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-e4a239ba34f85a499da941cd3eb8c5da-f82bae736d920648-00"}
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-books-F-94939---Update---Delete-lifecycle-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-books-F-94939---Update---Delete-lifecycle-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.