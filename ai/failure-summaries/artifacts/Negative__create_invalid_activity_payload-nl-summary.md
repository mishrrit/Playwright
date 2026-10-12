# Negative: create invalid activity payload

**Status:** failed

## Summary

```text
Test: Negative: create invalid activity payload
Error: Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m

Expected value: [32mundefined[39m
Received array: [31m[400, 422, 500][39m
Top stack: Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoContain[2m([22m[32mexpected[39m[2m) // indexOf[22m
Attachments: C:\projects\Playwright\test-results\api-tests-fakerest-activit-d909a-te-invalid-activity-payload-api\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\api-tests-fakerest-activit-d909a-te-invalid-activity-payload-api\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.