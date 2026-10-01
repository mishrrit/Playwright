# Progress Bar: Start progress bar and wait for 75%

**Status:** failed

## Summary

```text
Test: Progress Bar: Start progress bar and wait for 75%
Error: Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

Expected: >= [32m75[39m
Received:    [31m68[39m

Call Log:
- Test timeout of 30000ms exceeded
Top stack: Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeGreaterThanOrEqual[2m([22m[32mexpected[39m[2m)[22m
Attachments: C:\projects\Playwright\test-results\ui-testing-playground-prog-f46c8-ogress-bar-and-wait-for-75--ui-testing-playground-firefox\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\ui-testing-playground-prog-f46c8-ogress-bar-and-wait-for-75--ui-testing-playground-firefox\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.