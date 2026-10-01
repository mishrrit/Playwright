# Dynamic Table: Compare CPU values

**Status:** failed

## Summary

```text
Test: Dynamic Table: Compare CPU values
Error: Error: [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m

Expected: not [32m-1[39m
Top stack: Error: [2mexpect([22m[31mreceived[39m[2m).[22mnot[2m.[22mtoBe[2m([22m[32mexpected[39m[2m) // Object.is equality[22m
Attachments: C:\projects\Playwright\test-results\ui-testing-playground-pom--a5c5d-ic-Table-Compare-CPU-values-ui-testing-playground-firefox\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\ui-testing-playground-pom--a5c5d-ic-Table-Compare-CPU-values-ui-testing-playground-firefox\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.