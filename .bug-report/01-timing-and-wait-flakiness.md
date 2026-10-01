# Bug Group: Timing / Wait Flakiness

Affected tests:
- `ui/tests/ui-testing-playground/dynamic-table.spec.ts` -> Dynamic Table: Compare CPU values
- `ui/tests/ui-testing-playground/pom-refactored.spec.ts` -> Progress Bar start/stop failures
- `ui/tests/ui-testing-playground/pom-refactored.spec.ts` -> Visibility: removed button still visible
- `ui/tests/ui-testing-playground/ajax-data.spec.ts` (Firefox) -> AJAX data not visible
- `ui/tests/ui-testing-playground/mouse-over-link.spec.ts` -> hover timing failures

Symptoms:
- Locators resolve to empty lists or unexpected values (e.g., header index -1).
- Progress bar assertions time out before reaching expected value.
- Elements expected to be hidden remain visible intermittently.
- Hover actions fail due to element detachment or intercepted pointer events.

Likely root causes:
- Tests assume immediate availability of dynamic content without explicit waits.
- Use of brittle locators or single-step assertions where polling is needed.
- Race conditions between test actions and page updates.

Suggested fixes (examples):

DynamicTablePage.getCpuColumnIndex — wait for headers before reading:

```ts
async getCpuColumnIndex(): Promise<number> {
  await expect(this.tableHeaders.first()).toBeVisible({ timeout: 10000 });
  const headerTexts = await this.tableHeaders.allInnerTexts();
  const cpuIndex = headerTexts.findIndex((text) => text.trim() === 'CPU');
  expect(cpuIndex).not.toBe(-1);
  return cpuIndex;
}
```

Progress bar — poll with retries or increase timeout:

```ts
await expect(async () => {
  const value = await progressBar.getProgressValue();
  return value >= 75;
}).toPass({ timeout: 20000 });
```

Visibility / Hover — prefer stable locators and ensure element state:

```ts
await expect(this.removedButton).toBeHidden({ timeout: 5000 });
await this.clickMeLink.scrollIntoViewIfNeeded();
await this.clickMeLink.hover();
```

Notes:
- These fixes prioritize robustness over speed; tune timeouts for CI.
- Consider adding retry logic or marking known-flaky tests with `@flaky` and collecting traces for investigation.

References:
- Playwright waiting best practices: https://playwright.dev/docs/wait-for

