# Natural-language failure summaries

A local, deterministic reporter and CLI that summarize **recorded failure evidence**. No AI model/provider is called. The report does not infer that every failure is a timing issue, nor recommend weakening assertions or increasing timeouts without investigation.

## Structure

- [src](./src/): TypeScript reporter and generator sources.
- [dist](./dist/): compiled CommonJS output, built with the pinned esbuild dependency; retained for the current root reporter configuration.
- [fixtures/sample-artifact.json](./fixtures/sample-artifact.json): intentional, non-sensitive CLI example, not a historical run output.
- `raw/<run-id>/`: ignored, local JSON for individual failing attempts and `run-index.json`.
- `artifacts/<run-id>/`: ignored, local text and Markdown summaries for those attempts.

Historical raw/generated files have been removed from Git tracking without deleting local copies. CI uploads current output as run artifacts. The intentional fixture and compiled reporter output remain source-controlled; untracking does not rewrite old commits.

## Build and use

From the repository root:

```powershell
npm ci
npm run build:ai
npm run ai:reporter-sample
```

The build uses the locally installed, lockfile-pinned esbuild version and explicitly emits CommonJS for Node 20+. The sample and generator npm scripts rebuild automatically and invoke compiled JavaScript; they no longer depend on ts-node's incompatible TypeScript API integration.

Summarize a real artifact (replace the placeholders with a recorded run/file):

```powershell
npm run ai:gen-summary -- 'ai\failure-summaries\raw\<run-id>\<attempt>.json' 'test-results\manual-summary'
```

The optional second argument selects an output directory. Without it, manual CLI runs write to `ai/failure-summaries/artifacts/`. The CLI prints the summary, writes `<input-name>-nl-summary.txt`, and exits with code 2 for missing input, malformed JSON, or output errors. Reprocessing the same input into the same output directory replaces its summary deliberately. The reporter imports the same `summarize` function directly and writes its text summary once in its run-specific directory; it does not invoke the CLI.

## Reporter behavior

The existing root configuration loads the compiled reporter. Available options are:

```typescript
[
  "./ai/failure-summaries/dist/nl-failure-reporter.js",
  {
    outDir: "ai/failure-summaries/raw",
    artifactsDir: "ai/failure-summaries/artifacts",
    allureResultsDir: "allure-results",
  },
]
```

- Each reporter instance uses a unique UUID run directory. Files include a shortened title, a hash of test ID/project/source location/title path/repeat index, and the retry index. Equal titles in different files, browsers, repeats, retries, or runs do not overwrite one another.
- `failed` and `timedOut` attempts are captured, including expected failures. Passed, skipped, and interrupted attempts are not captured. The reporter creates no output directories for a run without captured failures.
- Every attempt records its actual status, retry index, expected status, duration, errors, and attachment metadata. Inline attachment names are not treated as filesystem paths.
- A failed attempt is not necessarily a failed final test: `run-index.json`, written at `onEnd`, associates each captured attempt with Playwright's final `expected`, `unexpected`, `flaky`, or `skipped` outcome. An expected failure therefore remains distinguishable from an unexpected one. If the process terminates before `onEnd`, attempt evidence may exist without this index; do not infer a final outcome.
- Summaries report all supplied errors/stacks and explicitly state that the root cause is undetermined. Inspect traces, HTTP responses, and contract expectations before suggesting a fix.
- Markdown copies beside a real attachment and in an existing Allure results directory include the run ID in their names. Links are resolved relative to each copy. Set `allureResultsDir: false` to disable the Allure-directory copy.
- A loose Markdown file in Allure results is **not** an inline Allure test attachment. The reporter no longer emits orphan attachment-descriptor JSON pretending to provide that association. Native Allure attachment integration remains separate work.
- Summary generation runs in-process through the shared `summarize` function. No Node subprocess is started per failure. The standalone CLI still uses that same formatter. This removes process-launch overhead without changing the summary content or claiming an unmeasured percentage speedup.

## Verification

```powershell
# Builds the reporter and runs all local framework regressions
npm run test:framework

# Only reporting, generator, and schema-validation regressions
npm run test:framework -- reporting.spec.ts
```

[Reporting regressions](../../api/tests/framework/reporting.spec.ts) verify artifact identity, timeouts, retries, expected failures, final outcomes, attachment links, malformed CLI input, and real Ajv validation. They also disable all child-process launch APIs while exercising the reporter, and compare its summary with CLI output. A nested local Playwright run intentionally fails synthetic tests to exercise reporter callbacks; the enclosing regression passes only if the recorded evidence is correct.

[Cleanup regressions](../../api/tests/framework/cleanup.spec.ts) cover import side effects, retention, archive failure, empty/missing directories, unrelated files, junction/symlink rejection, CLI exit status, and npm/direct Playwright setup. Cleanup integration runs use temporary repositories and check that shared cleanup executes once while Playwright owns a custom test output directory. No verification cleanup targets real repository reports. Temporary workspaces are removed after each test; public APIs and browsers are not required.

## Dependency choices

- Ajv is a declared dependency with its own types. The former ambient `any` shim has been removed; runtime schema validation is now test-covered.
- `allure-commandline` is the single selected Allure CLI. `allure-playwright` remains the adapter. The separate `allure` package has been removed to avoid two packages providing the same executable.
- Use `npm ci` to reproduce the committed lockfile. No on-demand, unpinned esbuild download is required by the build script.

## Cleanup ownership and retention

[scripts/clean-ai.js](../../scripts/clean-ai.js) is the shared implementation and guarded CLI. Importing it performs no cleanup. Its [type declaration](../../scripts/clean-ai.d.ts) describes the options and result for TypeScript callers.

| Entry point | Behavior |
| --- | --- |
| `npm test` | `pretest` builds the reporter only; root global setup then invokes shared cleanup once |
| Direct Playwright run with root config | Root setup validates plans and calls the same shared cleanup once |
| `npm run clean:ai` | Explicit manual cleanup using the same archive policy; additionally resets the conventional `test-results/` directory |
| Offline framework runner | Does not run root cleanup; cleanup tests exercise temporary repositories only |

Global setup passes `includeTestResults: false`: Playwright cleans its configured project output directories. This avoids duplicate deletion and avoids assuming that every project uses `test-results/`. Manual `clean:ai` deliberately keeps its conventional `test-results/` behavior; it does not discover custom project output directories.

Both automatic and manual cleanup:

1. Preflight only the managed paths beneath the selected root. Reject filesystem-root cleanup, symlinks/junctions in managed paths, and files where directories are expected.
2. Move non-empty previous `allure-results/` into a uniquely named timestamp/UUID directory under `allure-archive/` **before** deleting current AI artifacts. An archive failure aborts instead of losing the old results.
3. Reset `ai/failure-summaries/raw/` and `ai/failure-summaries/artifacts/`, and recreate the Allure results directory. Empty results are not archived.
4. Retain up to `ALLURE_KEEP_RUNS` recognized archives (default **3**). `0` explicitly retains none. Invalid values, including fractional or partially numeric strings, produce a warning and fall back to 3. Retention is enforced even when there are no new Allure results.

Only directories matching the cleanup tool's legacy timestamp or timestamp/UUID naming patterns are pruned; unrelated files/directories under `allure-archive/` remain untouched. The newly archived run is retained first, followed by existing recognized archives in descending timestamp-name order. Cleanup errors propagate and stop test setup; they are not silently ignored. Filesystem cleanup is not transactional: an error after successful archiving can leave some managed directories reset, but the archived results remain available subject to the chosen retention policy.

To choose retention for a standard run in PowerShell:

```powershell
$env:ALLURE_KEEP_RUNS = '5'
npm test -- --config=playwright.config.ts --project=api
```

Manual cleanup is available with `npm run clean:ai`, but is not needed before a normal test run. Run these commands from the repository root and preserve needed evidence first. Allure HTML generation remains in global teardown and is unchanged.

## Safety limits

Shared report directories still do **not** support concurrent root-config sessions. Unique reporter run folders prevent filename collisions, not one run's startup cleanup deleting another run's artifacts. Symlink checks are preflight checks, not protection against concurrent filesystem changes; use a dedicated workspace for each simultaneous run.

Artifacts can contain raw error messages, stack traces, and attachment paths. Treat them as potentially sensitive and apply appropriate access/retention controls. Local historical artifacts were preserved when Git tracking was removed, but invoking standard cleanup still clears managed run output as documented. The CI workflow uploads summaries alongside Allure/test output rather than relying on committed run history. Source-file consolidation remains separate work.
