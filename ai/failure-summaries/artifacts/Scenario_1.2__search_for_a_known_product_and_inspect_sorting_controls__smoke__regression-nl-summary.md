# Scenario 1.2: search for a known product and inspect sorting controls @smoke @regression

**Status:** failed

## Summary

```text
Test: Scenario 1.2: search for a known product and inspect sorting controls @smoke @regression
Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveValue[2m([22m[32mexpected[39m[2m)[22m failed

Locator:  getByRole('combobox').nth(1)
Expected: [32m"10"[39m
Received: [31m"[7mhttps://demowebshop.tricentis.com/search?q=laptop&orderby=[27m10"[39m
Timeout:  5000ms

Call log:
[2m  - Expect "toHaveValue" with timeout 5000ms[22m
[2m  - waiting for getByRole('combobox').nth(1)[22m
[2m    - waiting for navigation to finish...[22m
[2m    - navigated to "https://demowebshop.tricentis.com/search?q=laptop&orderby=10"[22m
[2m    12 × locator resolved to <select id="products-orderby" name="products-orderby" onchange="setLocation(this.value);">…</select>[22m
[2m       - unexpected value "https://demowebshop.tricentis.com/search?q=laptop&orderby=10"[22m

Top stack: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoHaveValue[2m([22m[32mexpected[39m[2m)[22m failed
Attachments: C:\projects\Playwright\test-results\demo-web-shop-search-produ-35e4e-g-controls-smoke-regression-demo-web-shop-chromium\error-context.md
Probable cause: Flaky timing or missing wait
Suggested fix: Add a `await page.waitForSelector(...)` or increase timeout for the failing step.
```

## Attachments

- [error-context.md](test-results\demo-web-shop-search-produ-35e4e-g-controls-smoke-regression-demo-web-shop-chromium\error-context.md)

## Probable cause

- Flaky timing or missing wait (auto-detected)

## Suggested fix

- Add `await page.waitForSelector(...)` or increase timeout for the failing step.