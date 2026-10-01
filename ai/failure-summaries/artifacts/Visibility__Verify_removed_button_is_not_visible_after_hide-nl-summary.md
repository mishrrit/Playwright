# Visibility: Verify removed button is not visible after hide

**Status:** failed

## Summary

```text
Test: Visibility: Verify removed button is not visible after hide
Error: Error: [2mexpect([22m[31mlocator[39m[2m).not.[22mtoBeVisible[2m([22m[2m)[22m failed

Locator:  locator('#removedButton')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
[2m  - Expect "not toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('#removedButton')[22m
[2m    14 × locator resolved to <button type="button" id="removedButton" class="btn btn-danger">Removed</button>[22m
[2m       - unexpected value "visible"[22m

Top stack: Error: [2mexpect([22m[31mlocator[39m[2m).not.[22mtoBeVisible[2m([22m[2m)[22m failed
Attachments: C:\projects\Playwright\test-results\ui-testing-playground-pom--bc8ed-n-is-not-visible-after-hide-ui-testing-playground-chromium\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\ui-testing-playground-pom--bc8ed-n-is-not-visible-after-hide-ui-testing-playground-chromium\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.