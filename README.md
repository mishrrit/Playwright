# Playwright Test Framework

Playwright-based **UI and API testing** with application-specific page objects, API service wrappers, reusable fixtures, and multi-browser execution.

## Documentation

| Guide | Use it for |
| --- | --- |
| [Framework flow](flow.md) | Follow test execution through fixtures, classes, methods, assertions, and reports |
| [Decision log](decision.md) | Understand existing design choices and record important refactoring/testing decisions |
| [UI architecture](ui/ui_test_architecture.md) | Page inheritance, fixture lifecycle, UI workflow diagrams, and adding applications/tests |
| [API architecture](api/api_test_architecture.md) | Service inheritance, named API routing, API workflow diagrams, and adding services/tests |
| [Test plans](test-plans/README.md) | Scenario planning and test-plan conventions |
| [Failure summaries](ai/failure-summaries/README.md) | Local evidence summaries, per-attempt artifacts, and final test outcomes |

This README covers setup, execution, configuration, and reporting. Detailed class relationships and diagrams are maintained in the architecture guides.

## What's Included

- **Playwright Test runner** with TypeScript and JavaScript support
- **Configured browser projects**: Chromium and Firefox where supported by the suite
- **Page Object Model (POM)** architecture for maintainable tests
- **Custom fixtures** for authentication and test setup
- **API service fixtures** with separate Booking and FakeRest hosts
- **Allure reporting** and configurable Playwright diagnostics
- **Local framework regression tests** for routing and assertion behavior
- **Pre-configured base URLs** for demo applications

## Prerequisites

- Node.js 24 LTS recommended (current Faker dependency requires Node 20.19+, 22.13+, 23.5+, or 24+ within its supported major ranges)
- npm 10 or newer
- Network access to the target demo APIs/websites for live tests
- Java available on `PATH` when generating reports with `allure-commandline`

## Setup

From the repository root, restore dependencies and install the configured UI browsers:

```powershell
npm ci
npx playwright install chromium firefox
```

API-only request tests do not require browser binaries. The optional VS Code **Playwright Test for VS Code** extension provides test discovery and debugging.

Build tooling and schema validation use declared, lockfile-pinned esbuild and Ajv dependencies. `allure-commandline` is the single Allure CLI; `allure-playwright` remains the reporter adapter.

Before using direct Playwright commands with the root configuration, build the custom reporter:

```powershell
npm run build:ai
```

`npm test` runs this build automatically through its `pretest` script. Direct `npx playwright test` commands do not run npm lifecycle scripts.

## Running Tests

Start with a selected suite rather than all projects. Live tests can create or modify demo data. The generic API/UI integration example also requires an application providing its expected endpoints and login page.

```powershell
# Discover tests without executing them
npx playwright test --config=playwright.config.ts --list

# Run every configured project (includes live UI/API tests)
npm test -- --config=playwright.config.ts
```

### Run Specific Test Suites

```powershell
# Select UI suites through their configured project names
npx playwright test --config=playwright.config.ts --project=todo-mvc-chromium
npx playwright test --config=playwright.config.ts --project=ui-testing-playground-firefox
npx playwright test --config=playwright.config.ts --project=orange-hrm-chromium
npx playwright test --config=playwright.config.ts --project=demo-web-shop-chromium
npx playwright test --config=playwright.config.ts --project=practice-test-automation-chromium
npx playwright test --config=playwright.config.ts --project=saucedemo-chromium

# API suites: quoted regular expressions match Windows or Unix path separators
npx playwright test --config=playwright.config.ts --project=api 'api[\\/]tests[\\/]booker'
npx playwright test --config=playwright.config.ts --project=api 'api[\\/]tests[\\/]fakerest'

# One scenario by title, within a selected project
npx playwright test --config=playwright.config.ts --project=api --grep 'Activities smoke'
```

[playwright.config.ts](playwright.config.ts) is the canonical root configuration. The obsolete emitted JavaScript configuration has been removed; [tsconfig.json](tsconfig.json) sets `noEmit: true` so typechecking does not recreate it. The explicit reporter build still writes its intended compiled output.

### Multiple API hosts

Booking and FakeRest service fixtures automatically select separate hosts, including when both suites run in parallel. Configure each target in the ignored root `.env` file or CI environment:

```dotenv
BOOKING_API_BASE_URL=https://restful-booker.herokuapp.com
FAKEREST_API_BASE_URL=https://fakerestapi.azurewebsites.net
```

These are also the defaults. `API_BASE_URL` remains available for generic API/UI callers, but no longer controls Booking or FakeRest service fixtures. Move existing suite-specific overrides to the corresponding named variable.

Service endpoints remain relative to their named host; optional gateway prefixes are preserved. FakeRest does **not persist writes**: its tests verify endpoint response contracts, not stored CRUD lifecycles. Credentials belong in environment/CI secrets, never committed data files.

UI hosts are configured separately in [Playwright projects](playwright.config.ts). The root config does not currently enable dotenv loading for UI settings; changing an API host variable does not redirect a website.

See [API architecture and onboarding conventions](api/api_test_architecture.md#multiple-api-hosts-and-automatic-endpoint-routing) for credentials, additional APIs, and fixtures.

Run the offline framework regressions without public API access or global report cleanup. The npm command first builds the reporter required by the reporting tests:

```powershell
npm run test:framework
```

### Interactive Running and Debugging

```powershell
npx playwright test --config=playwright.config.ts --project=saucedemo-chromium --headed
npx playwright test --config=playwright.config.ts --project=saucedemo-chromium --debug
npx playwright test --config=playwright.config.ts --ui
```

## Reports and Run Lifecycle

1. `npm test` builds the reporter in `pretest`; it no longer performs a separate cleanup. Direct Playwright commands still require a prior reporter build.
2. Standard root-config runs validate test plans and invoke shared cleanup once: previous Allure results are archived, then current AI artifact directories are reset. Playwright itself cleans the configured test output directories.
3. Tests execute using their selected projects and fixtures; reporters produce line output, Allure results, and local evidence summaries for failed/timed-out attempts. Run-specific artifacts and a final outcome index distinguish retry failures from flaky or expected outcomes; no AI model is called.
4. Global teardown attempts to generate the Allure report. See the [AI tooling guide](ai/failure-summaries/README.md) for summary generation details.

**Preserve any needed artifacts before rerunning.** Even filtered standard runs invoke global hooks. Allure archive retention defaults to 3 runs and can be set with `ALLURE_KEEP_RUNS`; `0` keeps none. Cleanup errors stop setup. `npm run clean:ai` remains an explicit manual option, not a required pre-test step. See [cleanup ownership and retention](ai/failure-summaries/README.md#cleanup-ownership-and-retention).

Summary formatting runs in-process; no child process is started per failure. Avoid concurrent runs sharing report directories. The offline framework configuration does not apply root cleanup to this workspace; its cleanup regressions use temporary repositories.

```powershell
# Open the Allure report produced by global teardown
npx allure open allure-report

# Regenerate manually when needed
npx allure generate allure-results -o allure-report --clean

# Opt into Playwright HTML reporting for a run
npx playwright test --config=playwright.config.ts --project=saucedemo-chromium --reporter=line,html
npx playwright show-report
```

The `--reporter` flag replaces the configured reporters for that run; the example above does not collect Allure/AI reporter output, while global hooks still execute. `npm run test:report` opens an existing Playwright HTML report; it does not generate one. HTML is not a default reporter.

Traces are collected on the first retry. Automatic failure screenshots are not enabled by default; configure them explicitly when required.

## Project Structure

```text
.
├── playwright.config.ts         Projects, browsers, hosts, reporters
├── playwright-global-setup.ts   Test-plan validation and run setup
├── package.json                 Dependencies and npm commands
├── ui/                          UI pages, fixtures, data, and test suites
├── api/                         API configuration, services, fixtures, and tests
├── test-plans/                  Scenario plans and planning conventions
├── scripts/                     Validation, cleanup, and tooling scripts
├── ai/failure-summaries/        AI reporter and summary tooling
├── allure-results/              Generated raw Allure results
├── allure-report/               Generated Allure report
├── playwright-report/           Optional generated Playwright HTML report
├── test-results/                Generated test artifacts
└── README.md
```

For folder-level responsibilities, class relationships, and extension examples, use the [UI guide](ui/ui_test_architecture.md) or [API guide](api/api_test_architecture.md).

## Repository Hygiene

- Track source, configuration, intentional fixtures, and the dependency lockfile—not installed dependencies or per-run reports.
- Installed dependencies, raw failure artifacts, generated summaries, and generated HTML reports are excluded from Git tracking. Local copies are retained; use `npm ci` to restore dependencies in a fresh checkout.
- [Compiled reporter output](ai/failure-summaries/dist/) remains tracked for direct Playwright/VS Code loading. Rebuild it after reporter source changes. [Intentional sample data](ai/failure-summaries/fixtures/sample-artifact.json) stays separate from runtime artifacts.
- Existing diagnostic notes and repair history are retained. Ignoring/untracking current artifacts does not remove them from earlier Git commits.
- Use targeted ignore rules; JavaScript is legitimate source in parts of this framework. [.gitattributes](.gitattributes) continues to control text normalization, not generated-file retention.

## Continuous Integration

[Playwright CI](.github/workflows/playwright.yml) uses Node 24 in all jobs:

1. **Validation:** restore locked dependencies, typecheck with `npx tsc` (no emission), then run `npm run test:framework`. Its pre-script builds the reporter once; this job does not run public application tests or install browsers.
2. **Live matrix:** after validation passes, run API service suites and the existing SauceDemo Chromium suite in separate jobs. API selection excludes `api/tests/framework/`, so offline regressions are not repeated. Other configured UI suites remain available through local/project commands; this matrix does not claim full UI-project coverage.
3. **Provisioning:** install Chromium and Linux system dependencies only for the UI job. Both live jobs provision Java for the selected Allure CLI and build their own reporter through `npm test` preparation.
4. **Artifacts:** upload actual Allure results/report, test output, and failure-summary directories under unique matrix artifact names. The workflow does not assume that a Playwright HTML report exists. Matrix failure does not automatically cancel the other suite.

Live-result retention is 30 days; offline failure artifacts are retained for 7 days. Live suites still require available target services and correct API-specific environment settings.

## Adding or Maintaining Tests

1. Define the scenario and expected application/API contract in the relevant [test plan](test-plans/README.md).
2. Follow the [UI scaling guide](ui/ui_test_architecture.md#scaling-the-ui-framework) or [API scaling guide](api/api_test_architecture.md#scaling-where-to-make-changes); reuse the existing fixtures and page/service classes. FakeRest Books uses one `booksService`; SauceDemo account consumers use the [typed canonical dataset](ui/test-data/saucedemo/users.ts), with scenario expectations kept in tests.
3. Keep hosts configurable and secrets out of committed code/data. Add a new project or API target only when needed.
4. Run the smallest affected suite, investigate failures, and preserve meaningful assertions. Do not skip tests or broaden expected statuses simply to obtain a pass.
5. Update directly related documentation and keep generated reports out of source changes.

## Test Suites Overview

| Suite | Focus | Project(s) |
| --- | --- | --- |
| TodoMVC | Todo actions and filtering | `todo-mvc-chromium`, `todo-mvc-firefox` |
| UI Testing Playground | Dynamic elements, waits, visibility, and interactions | `ui-testing-playground-chromium`, `ui-testing-playground-firefox` |
| Demo Web Shop | Storefront scenarios | `demo-web-shop-chromium` |
| Practice Test Automation | Positive and negative login | `practice-test-automation-chromium` |
| SauceDemo | Login, products, cart, and checkout | `saucedemo-chromium` |
| OrangeHRM | Employee UI scenarios; CommonJS page objects | `orange-hrm-chromium` |
| Restful-Booker | Booking and authentication endpoints | `api` (filter `booker`) |
| FakeRest | Books, authors, activities, covers, and users | `api` (filter `fakerest`) |
| Framework regression | Local routing and assertion behavior | Dedicated offline config |

Use `--list` for current discovery counts rather than relying on a static file count.

## Configuration Highlights

- **Test timeout**: 30 seconds
- **Assertion timeout**: 5 seconds
- **Parallel execution**: Enabled (`fullyParallel: true`)
- **Retries**: 2 on CI, 0 locally
- **Trace collection**: On first retry
- **Screenshot comparison tolerance**: `toHaveScreenshot.maxDiffPixels = 10`
- **Snapshot comparison tolerance**: `toMatchSnapshot.maxDiffPixelRatio = 0.1`

These are root defaults; individual projects/tests can override them. See [playwright.config.ts](playwright.config.ts) for the source of truth.

## Troubleshooting

- **No tests found:** select the TypeScript config and the correct project; inspect `--list` output. CLI file filters are regular expressions, so use the quoted patterns above on Windows.
- **Custom reporter cannot load:** run `npm run build:ai` before a direct Playwright invocation. Check the build output if it fails.
- **Tests stop before execution:** inspect the test-plan validator output from global setup; this is separate from an application assertion failure.
- **No HTML report:** opt into the HTML reporter first; the default output is Allure, line, and AI reporting.
- **Missing browser executable:** install the required browser with `npx playwright install chromium firefox`.
- **Unexpected API 404:** check the named target and endpoint contract. FakeRest POST responses do not imply data was persisted.

## References

- <https://playwright.dev/docs/intro>
- <https://playwright.dev/docs/test-configuration>
- <https://playwright.dev/docs/page-object-models>

## Maintainers / Contact

- Ritesh Mishra

