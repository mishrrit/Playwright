# Progress Bar: Stop at 75% and verify final value

**Status:** failed

## Summary

```text
Test: Progress Bar: Stop at 75% and verify final value
Error: Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

Expected: >= [32m75[39m
Received:    [31m66[39m

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
Top stack: Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m([22m[32mexpected[39m[2m)[22m
Attachments: C:\projects\Playwright\test-results\ui-testing-playground-pom--e25f2-t-75-and-verify-final-value-ui-testing-playground-chromium\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\ui-testing-playground-pom--e25f2-t-75-and-verify-final-value-ui-testing-playground-chromium\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.