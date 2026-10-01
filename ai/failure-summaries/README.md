# Natural-language failure summaries

This folder contains the reporter and CLI used to produce natural-language summaries for failed Playwright tests.

Structure

- src/: TypeScript source for the reporter and generator CLI.
- dist/: compiled JS output (produced by build script).
- raw/: raw failure artifacts produced by the reporter at runtime.
- artifacts/: generated human-readable summaries.

Quick build & test (local)

Install dependencies if needed (esbuild available via npx):

```bash
npm ci
```

Build compiled output:

```bash
npx esbuild ai/failure-summaries/src/*.ts --platform=node --target=node16 --outdir=ai/failure-summaries/dist
```

Run generator against a sample artifact:

```bash
node ai/failure-summaries/dist/generate-summary.js ai/failure-summaries/raw/sample-artifact.json
```

Playwright integration

- Add `["./ai/failure-summaries/dist/nl-failure-reporter.js", { outDir: "ai/failure-summaries/raw" }]` to Playwright `reporter` list.

Cleanup guideline

- The test `global-setup` cleans previous run artifacts automatically (it removes and recreates `test-results`, `allure-results`, and `ai/failure-summaries/raw` and `ai/failure-summaries/artifacts`).
- To avoid stale summaries or PII leakage, ensure local and CI runs start with a clean workspace or rely on the provided `global-setup`.
- If you add other AI capabilities, update `support/global-setup/global-setup.ts` to include their `raw`/`artifacts` directories in the cleanup list.
