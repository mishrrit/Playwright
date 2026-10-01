# AJAX Data: Test for text visibility after clicking a button

**Status:** failed

## Summary

```text
Test: AJAX Data: Test for text visibility after clicking a button
Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByText('Data loaded with AJAX get request.')
Expected: visible
Timeout: 16000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 16000ms[22m
[2m  - waiting for getByText('Data loaded with AJAX get request.')[22m

Top stack: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
Attachments: C:\projects\Playwright\test-results\ui-testing-playground-ajax-fcabf-ity-after-clicking-a-button-ui-testing-playground-firefox\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\ui-testing-playground-ajax-fcabf-ity-after-clicking-a-button-ui-testing-playground-firefox\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.