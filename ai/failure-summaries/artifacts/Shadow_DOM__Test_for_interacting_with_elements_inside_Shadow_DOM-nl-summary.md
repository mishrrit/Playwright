# Shadow DOM: Test for interacting with elements inside Shadow DOM

**Status:** failed

## Summary

```text
Test: Shadow DOM: Test for interacting with elements inside Shadow DOM
Error: Error: browserContext.grantPermissions: Unknown permission: clipboard-read
Top stack: Error: browserContext.grantPermissions: Unknown permission: clipboard-read
Attachments: C:\projects\Playwright\test-results\ui-testing-playground-shad-a0fb9--elements-inside-Shadow-DOM-ui-testing-playground-firefox\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\ui-testing-playground-shad-a0fb9--elements-inside-Shadow-DOM-ui-testing-playground-firefox\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.