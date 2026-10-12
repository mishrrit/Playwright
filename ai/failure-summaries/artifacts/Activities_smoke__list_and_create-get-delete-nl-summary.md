# Activities smoke: list and create-get-delete

**Status:** failed

## Summary

```text
Test: Activities smoke: list and create-get-delete
Error: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-8b159385472c6049a4dddc51600835ea-c1e4e28d53aa104b-00"}
Top stack: Error: HTTP 404 - {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.4","title":"Not Found","status":404,"traceId":"00-8b159385472c6049a4dddc51600835ea-c1e4e28d53aa104b-00"}
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-activit-16373--list-and-create-get-delete-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-activit-16373--list-and-create-get-delete-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.