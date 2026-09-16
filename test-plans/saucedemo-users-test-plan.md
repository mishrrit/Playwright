# Sauce Demo — Users Test Plan

## Overview
This plan exercises all user accounts listed on the Sauce Demo login page and covers functional, negative, performance, and visual checks per user. Base URL: https://www.saucedemo.com/

## Listed users and credentials (from the login page)
- `standard_user` — password: `secret_sauce`
- `locked_out_user` — password: `secret_sauce`
- `problem_user` — password: `secret_sauce`
- `performance_glitch_user` — password: `secret_sauce`
- `error_user` — password: `secret_sauce`
- `visual_user` — password: `secret_sauce`

## Test matrix: common scenarios (applies to all applicable users)
- Login: valid credentials -> lands on Products page.
- Login: invalid password -> shows error message; remains on login page.
- Login: invalid username -> shows error message.
- Logout: user can logout from the app and returns to login page.
- Add to cart: add single and multiple products; cart count increments.
- Remove from cart: remove items; cart count decrements.
- Checkout happy path: add item(s) -> cart -> checkout information -> finish -> shows confirmation.
- Sorting and filtering on Products page (name low->high, high->low, price low->high, high->low).
- Product details: can open product details page and return back.

## Per-user test cases

### `standard_user` (happy path)
- TC-STD-01: Login with `standard_user`/`secret_sauce` -> expect Products page and product list visible.
- TC-STD-02: Add multiple items to cart -> expect cart badge reflect count and items present.
- TC-STD-03: Complete checkout -> expect order completion message and successful redirect to products or success page.
- TC-STD-04: Sorting and product details behave normally.
- Note: This user should exercise all normal flows.

### `locked_out_user` (access denied)
- TC-LOCK-01: Login with `locked_out_user`/`secret_sauce` -> expect an account-locked error message and no navigation to Products.
- TC-LOCK-02: Attempt checkout flow not possible since login blocked.
- Automation note: assert exact error text shown on the login form.

### `problem_user` (data/visual inconsistencies)
- TC-PROB-01: Login -> Products page loads but some product images or links may be broken or swapped.
- TC-PROB-02: Add to cart -> verify correct item added (by name, not by image).
- TC-PROB-03: Product detail pages might show wrong images/descriptions -> assert product identity via name and price.
- Test focus: functional correctness takes precedence; detect and log mismatches between image and product metadata.

### `performance_glitch_user` (slow responses)
- TC-PERF-01: Login -> may be slow to navigate to Products page. Measure time-to-interactive; expect higher latency.
- TC-PERF-02: Add to cart and navigate pages -> record response times and verify eventual correctness.
- TC-PERF-03: Checkout flow under slow conditions; ensure eventual success and no data loss.
- Performance checks: capture timings for page load, add-to-cart, and checkout submission. Flag if > threshold (e.g., 3s).

### `error_user` (server-side error simulation)
- TC-ERR-01: Login -> may surface server or application errors; assert presence of error alert or status code handling.
- TC-ERR-02: Attempt product operations -> verify graceful error handling, user-friendly messages, and no client crash.
- Note: Focus on resilience and error messages.

### `visual_user` (visual diffs)
- TC-VIS-01: Login and navigate -> run a visual snapshot of the Products page and compare against baseline.
- TC-VIS-02: Product cards layout, spacing, and icons should match the expected baseline. Flag visual differences.
- Visual testing: use consistent viewport sizes and deterministic data for reliable comparisons.

## Negative and security tests
- TC-NEG-01: SQL/command injection strings as username/password -> expect sanitized input and error message.
- TC-NEG-02: Long username/password inputs -> app handles without crashing.
- TC-NEG-03: CSRF and session fixation checks (where applicable).

## Cross-cutting checks
- Accessibility: run basic a11y scan on Products and Checkout pages (contrast, labels, keyboard navigation).
- Responsiveness: test mobile and tablet viewport breakpoints for critical flows (login, products, cart, checkout).
- Browser matrix: Chrome (latest), Firefox (latest), Edge (latest). Optionally Safari.
- Network conditions: test with throttled network for `performance_glitch_user` scenarios.

## Test data and environment
- Base URL: `https://www.saucedemo.com/`
- Use isolated sessions for each user (clear cookies/localStorage between runs).
- Password for all users: `secret_sauce` (as shown on login page).

## Automation notes / Playwright
- Use Playwright to script login, add/remove cart, checkout flows for `standard_user` as the baseline.
- Add separate tests parametrized by username to cover per-user expectations (locked out, problem, performance, error, visual).
- For `visual_user`, integrate Playwright snapshotting or Percy/Chromatic for visual diffs.
- For `performance_glitch_user`, measure and assert timings or log them for investigation (do not hard-fail unless thresholds exceeded).

## Deliverables
- Automated test cases per TC-* ID in the repository under `tests/saucedemo/` (optional next step).
- This test plan: `test-plans/saucedemo-users-test-plan.md` (this file).

---

If you want, I can now generate Playwright test skeletons (TS) for these cases or create the `tests/saucedemo/` folder with parametrized specs. Which would you like next?

