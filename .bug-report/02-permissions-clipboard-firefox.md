# Bug Group: Browser Permission / Clipboard (Firefox)

Affected tests:
- `ui/tests/ui-testing-playground/pom-refactored.spec.ts` -> Shadow DOM: interacting with clipboard
- `ui/tests/ui-testing-playground/shadow-dom.spec.ts` -> Shadow DOM clipboard test

Symptoms:
- `browserContext.grantPermissions(['clipboard-read', 'clipboard-write'])` fails on Firefox with `Unknown permission: clipboard-read`.

Root cause:
- `clipboard-read`/`clipboard-write` permission names and support vary across browsers. Firefox may not support `clipboard-read` via `grantPermissions` or uses different permission semantics.

Suggested fixes:
- Feature-detect permissions before granting, and guard Chromium-specific code paths:

```ts
if (context.browser()?.browserType().name() === 'chromium') {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
} else {
  test.skip(true, 'Clipboard permission not supported in this browser');
}
```

- Alternatively, avoid relying on `grantPermissions` for clipboard reads in Firefox: use `page.evaluate` fallback to read/write clipboard where possible or mock clipboard operations in test fixtures.

Notes:
- Prefer conditional test skipping for browser-specific features to keep suite stable across browsers.

