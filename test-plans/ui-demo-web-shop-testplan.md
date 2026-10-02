# Test Plan: Demo Web Shop Catalog and Validation

**Target:** https://demowebshop.tricentis.com/
**Seed:** Not available in this repository; use the existing `@playwright/test` and `pages/` conventions.
**Date:** 2026-09-15

## Overview

This plan covers the public Demo Web Shop catalog, product search, cart visibility, and login form validation without creating an account or placing an order. Scenarios use isolated browser contexts and only public, non-destructive actions so they remain suitable for a shared demo site.

## Preconditions

- The target site is reachable at `https://demowebshop.tricentis.com/`.
- Tests run with a fresh browser context and no account credentials.
- No existing Demo Web Shop page objects, seed test, or project configuration are assumed.
- Product names and result counts are asserted from the current public catalog where stable; no checkout or order completion is attempted.

## Scenarios

### Scenario 1.1 — Browse featured catalog and category
- **Priority:** P0
- **Tags:** @smoke @critical
- **Preconditions:** Start at the site root with an empty anonymous session.
- **Steps:**
  1. Open the site root — expected: the page title is `Demo Web Shop` and the welcome content is visible.
  2. Select the `Books` category link — expected: the Books category page opens.
  3. Inspect the product listing — expected: a product listing and category heading are visible.
- **Assertions:**
  - The home page exposes `Welcome to our store`.
  - The Books page URL ends with `/books` and contains at least one product link.
- **Edge cases considered:**
  - Category navigation is available from both the top navigation and sidebar; use the uniquely named top navigation link.
  - A fresh anonymous session must show an empty cart rather than inherited state.

### Scenario 1.2 — Search for a known product and inspect sorting controls
- **Priority:** P0
- **Tags:** @smoke @regression
- **Preconditions:** Start with a fresh anonymous session.
- **Steps:**
  1. Open the site root and submit `laptop` in the store search — expected: the Search page opens.
  2. Inspect the results — expected: `14.1-inch Laptop` is listed.
  3. Select `Price: Low to High` in the sort control — expected: the selected sort option changes while the result remains visible.
- **Assertions:**
  - The search heading is visible and the keyword field contains `laptop`.
  - The `14.1-inch Laptop` product link is visible.
  - The sort control has `Price: Low to High` selected after the change.
- **Edge cases considered:**
  - Search is submitted from the compact header search field, while assertions target the full search form.
  - Sorting must not remove the only matching result.

### Scenario 1.3 — Show a clear message for a no-match search
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** Start with a fresh anonymous session.
- **Steps:**
  1. Open the site root and submit `zzzz-no-such-product` in the store search — expected: the Search page opens with no products.
  2. Inspect the result message — expected: the no-products message is visible.
- **Assertions:**
  - The search keyword field contains `zzzz-no-such-product`.
  - `No products were found that matched your criteria.` is visible.
  - No product result link is visible in the results area.
- **Edge cases considered:**
  - The query is deliberately unlikely to match catalog data.
  - The test must assert the user-facing message rather than rely only on a zero count.

### Scenario 2.1 — Reject an empty login submission
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** Start with a fresh anonymous session at the login page.
- **Steps:**
  1. Open `/login` — expected: labeled Email and Password fields and a `Log in` button are visible.
  2. Submit the form without entering credentials — expected: validation prevents a successful login and the login page remains available.
- **Assertions:**
  - The login form remains visible after submission.
  - The page does not navigate to an authenticated customer area.
  - Any rendered validation or error message is visible and associated with the empty submission.
- **Edge cases considered:**
  - Do not use real-looking credentials during exploration or test generation.
  - The assertion should tolerate either HTML validation or a server-rendered validation message while still proving login did not succeed.

## Not covered (and why)

- Account registration and newsletter subscription: these mutate shared demo-site state and require personal-looking data.
- Checkout, payment, and order placement: these are terminal transactional flows and are outside safe exploration.
- Existing-account login: no test credentials are available in the repository.
- Wishlist, product reviews, and voting: these may mutate server-side state and are not necessary for the requested focused coverage.
- Visual snapshots, mobile layouts, and cross-browser expansion: they require additional baselines and project configuration not present in this repository.
