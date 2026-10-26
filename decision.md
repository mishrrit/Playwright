# Framework decision log

Record important decisions made while refactoring the framework or writing tests. Use [flow.md](flow.md) to understand execution; use this file to understand why a design or test contract should be preserved.

## How to maintain this log

- Add an entry in the same change as an important decision: public method/fixture changes, shared data ownership, routing, assertion intent, reporting, dependency/tooling changes, or deliberate compatibility exceptions.
- Record the problem, choice, rationale, alternatives, consequences, affected files, and actual validation. Routine renames/formatting do not need an entry unless they affect a contract.
- Do not invent historical dates, approvals, rejected alternatives, or successful test results. Distinguish observed implementation from a newly accepted decision.
- Keep old entries. If a choice changes, mark it superseded and link the replacement ID.
- Update [flow.md](flow.md) when a decision changes the execution path.
- This is a manually maintained log, not an automatic audit trail. Its existence does not configure agents or hooks to update it.

## Baseline and provenance

Entries DEC-001 through DEC-007 were **recorded on 2026-10-16 from existing source and repository documentation**. Their original adoption dates and decision owners are not established here. They document current choices, not refactorings performed while creating this log. Validation references identify existing coverage; no tests were executed for this documentation-only change.

| ID | Decision | Status |
| --- | --- | --- |
| DEC-001 | Separate UI actions, API operations, fixture lifecycle, and assertions | Observed baseline |
| DEC-002 | Route API services through named request contexts | Observed baseline |
| DEC-003 | Assert FakeRest response contracts, not persistent CRUD | Observed baseline |
| DEC-004 | Keep one canonical Books service and SauceDemo account dataset | Observed baseline |
| DEC-005 | Give shared report cleanup one owner | Observed baseline |
| DEC-006 | Summarize recorded failure evidence locally | Observed baseline |
| DEC-007 | Keep a canonical TypeScript config and reproducible reporter build | Observed baseline |
| DEC-008 | Maintain separate flow documentation and a decision history | Accepted for this documentation change |

## DEC-001: Separate behavior from lifecycle and assertions

- **Context:** Reusing interactions and endpoint calls should not force tests to duplicate browser/request setup or mix unrelated responsibilities.
- **Decision:** UI page objects receive Playwright's `Page`; API services inherit from `BaseAPI` and receive an `APIRequestContext`. Fixtures own dependency setup/teardown. Specs and shared test assertion helpers own scenario expectations.
- **Rationale:** This keeps shared behavior reusable while letting tests express their own outcomes. Inheritance, imports, and fixture injection are different relationships.
- **Consequences:** Most TypeScript UI tests construct their page objects explicitly. The UI base fixture only re-exports Playwright APIs. Existing specs can still contain direct `page` interactions; this is not a claim that all selectors have been moved into page objects.
- **Compatibility boundary:** OrangeHRM retains its separate CommonJS hierarchy; Playground retains an intermediate application base class. Do not silently unify these during unrelated work.
- **Alternatives:** No historical comparison is recorded. A universal auto-login/page-object fixture is not the current behavior.
- **Evidence:** [UI architecture](ui/ui_test_architecture.md), [API architecture](api/api_test_architecture.md), [UI fixture exports](ui/support/fixtures/base.ts), [API fixtures](api/fixtures/apiFixtures.ts).
- **Validation for future changes:** Run the affected application scenario and/or service regression; check fixture resource disposal and preserve assertion intent.

## DEC-002: Use named API contexts instead of one shared host

- **Context:** Booking and FakeRest must use different hosts even when their tests execute together.
- **Decision:** Named `booking` and `fakeRest` targets own their host variables; service fixtures inject the corresponding request contexts. `apiConfigs` permits explicit overrides. Generic `apiRequest` remains a separate path.
- **Rationale:** Host selection belongs in configuration/fixtures, not in resource service URLs. Keeping endpoints relative preserves configured gateway prefixes.
- **Consequences:** `BOOKING_API_BASE_URL` and `FAKEREST_API_BASE_URL` control their respective suites. Changing `API_BASE_URL` does not redirect named services. `BaseAPI.buildUrl()` rejects absolute endpoint forms; `normalizeBaseUrl()` validates and normalizes configured bases.
- **Alternatives:** The [README migration guidance](README.md#multiple-api-hosts) documents moving suite-specific overrides away from `API_BASE_URL`; no broader historical alternatives are claimed.
- **Evidence:** [apiConfig.ts](api/config/apiConfig.ts), [APIClient.ts](api/APIClient.ts), [apiFixtures.ts](api/fixtures/apiFixtures.ts), [BaseAPI.ts](api/base/BaseAPI.ts).
- **Validation reference:** Existing [offline framework regressions](api/tests/framework) cover routing. Future routing changes should verify both named hosts, overrides, relative paths, and gateway prefixes.

## DEC-003: Test FakeRest's non-persistent contract explicitly

- **Context:** FakeRest returns successful write responses without persisting the requested changes. Treating it as a stored CRUD system produces misleading tests.
- **Decision:** Verify write response echoes and seeded-record reads. Assert that writes do not imply persistence. Keep invalid-input/invalid-ID checks explicit.
- **Rationale:** Assertions must describe the target's behavior rather than assume conventional database semantics.
- **Consequences:** A successful create does not imply a later GET can retrieve the new payload. A successful delete does not imply a seeded record disappears. Shared helpers compare date fields by timestamp and update persistence checks run only when changes are supplied.
- **Alternatives:** Persistent CRUD assumptions are intentionally unsuitable for this API. This does not authorize weakening persistence assertions against other APIs that actually store writes.
- **Evidence:** [contractAssertions.ts](api/tests/fakerest/contractAssertions.ts), [Books smoke test](api/tests/fakerest/books.smoke.spec.ts), [API architecture](api/api_test_architecture.md).
- **Validation reference:** Existing framework assertion regressions and [FakeRest tests](api/tests/fakerest). Future changes must preserve negative checks and the distinction between echoed and stored state.

## DEC-004: Consolidate duplicate services and account data without losing coverage

- **Context:** Duplicate resource wrappers and account datasets create competing sources of truth.
- **Decision:** `BooksService`/`booksService` is the canonical FakeRest Books API. SauceDemo accounts come from `users.json` through the validated typed `users.ts` access module.
- **Rationale:** One implementation/dataset reduces drift; scenario expectations remain in tests rather than being inferred from credentials.
- **Consequences:** The architecture guides document removal of `FakeRestService`/`fakeRestService` and the duplicate SauceDemo dataset. Use `list`, `create`, `getById`, `update`, and `delete` for Books. Keep Books' serialized JSON write convention and versioned content type. Retain the problem-account success/cart checks and compatibility re-export modules.
- **Alternatives:** Keeping parallel wrappers/datasets was replaced by consolidation as documented in the architecture guides; this log does not assign an original decision date.
- **Evidence:** [Canonical Books service notes](api/api_test_architecture.md#canonical-books-service), [canonical account data notes](ui/ui_test_architecture.md#canonical-saucedemo-account-data), [BooksService.ts](api/services/BooksService.ts), [users.ts](ui/test-data/saucedemo/users.ts).
- **Validation reference:** Existing routing/write-payload and account-data regressions under [framework tests](api/tests/framework), plus retained live Books/SauceDemo scenarios. Consolidation must not silently remove negative or boundary coverage.

## DEC-005: Give shared cleanup one owner and isolate offline regressions

- **Context:** Repeated cleanup can erase evidence, while concurrent runs sharing report directories can interfere with each other.
- **Decision:** Root global setup delegates shared cleanup once; Playwright owns its configured output directories. `pretest` builds the reporter but does not separately clean reports. Allure results are archived with configurable retention. Offline framework regressions use a separate configuration without root hooks.
- **Rationale:** Explicit ownership avoids duplicate cleanup and allows framework regressions to run without resetting real workspace reports.
- **Consequences:** Even filtered root runs invoke cleanup. Archive retention defaults to three runs (`ALLURE_KEEP_RUNS`); cleanup failures stop setup. Cleanup-specific regressions use temporary repositories. Allure generation is attempted during teardown and its errors are logged rather than rethrown.
- **Alternatives:** Separate npm pretest cleanup is documented as removed; manual `clean:ai` remains an explicit option, not a required pre-step.
- **Evidence:** [Root setup](playwright-global-setup.ts), [UI setup](ui/support/global-setup/global-setup.ts), [teardown](ui/support/global-teardown/global-teardown.ts), [offline config](api/config/framework.playwright.config.ts), [cleanup ownership guide](ai/failure-summaries/README.md#cleanup-ownership-and-retention).
- **Validation reference:** Existing cleanup regressions verify retention, cleanup ownership, failures, and temporary-workspace isolation. Future lifecycle changes should use those tests before a live root-config run.

## DEC-006: Produce evidence-based, local failure summaries

- **Context:** A failed retry attempt, an expected failure, and an unexpected final outcome are not interchangeable. Recorded errors alone do not establish root cause.
- **Decision:** Use a deterministic local formatter/reporter without AI provider calls. Record failed/timed-out attempts with run-specific identities and produce a final outcome index. Format summaries in-process rather than spawning a process per failure.
- **Rationale:** Preserve the evidence and retry context without inventing diagnoses, conflating outcomes, or creating avoidable per-failure process overhead.
- **Consequences:** No automatic assertion weakening or timeout increases follow from a summary. A terminated run may have attempt artifacts without a final index. A loose Markdown file in Allure results is not a native Allure attachment. Do not claim measured performance gains without measurements.
- **Alternatives:** The guide documents removal of subprocess-per-failure formatting and orphan attachment-descriptor JSON. AI-based diagnosis is not part of the current implementation.
- **Evidence:** [Failure-summary guide](ai/failure-summaries/README.md), [reporter sources](ai/failure-summaries/src), [root reporter configuration](playwright.config.ts).
- **Validation reference:** Existing reporting regressions cover attempt identity, retry/final outcomes, expected failures, summary formatting, and attachment links.

## DEC-007: Keep configuration and reporter tooling explicit

- **Context:** Emitted configuration duplicates and implicit tooling downloads can make execution ambiguous or difficult to reproduce.
- **Decision:** Keep `playwright.config.ts` as the canonical root config and disable ordinary TypeScript emission. Build the reporter explicitly with declared esbuild; use declared Ajv for runtime schema validation and `allure-commandline` as the single Allure CLI.
- **Rationale:** Separate typechecking from the required reporter build and reproduce dependency versions through the lockfile.
- **Consequences:** Direct Playwright commands need a prior `npm run build:ai`. `npm test` and `npm run test:framework` build through their npm lifecycle hooks. TypeScript DTOs alone do not validate runtime API responses. Playwright HTML reporting is opt-in; `--reporter` replaces configured reporters for that run.
- **Alternatives:** The [README](README.md) and [dependency notes](ai/failure-summaries/README.md#dependency-choices) document removal of the obsolete emitted config, ts-node-based tooling path, and duplicate Allure CLI package.
- **Evidence:** [package.json](package.json), [lockfile](package-lock.json), [tsconfig.json](tsconfig.json), [playwright.config.ts](playwright.config.ts).
- **Validation reference:** Use the existing reporter build and relevant framework reporting/schema tests for changes to this path. No dependency installation or execution was needed for this log.

## DEC-008: Separate current flow from decision history

- **Recorded:** 2026-10-16.
- **Status:** Accepted for this documentation change, following the request for two root-level documents.
- **Context:** Architecture guides contain useful detail, but readers also need one execution walkthrough and a place to capture significant future choices.
- **Decision:** Add [flow.md](flow.md) for current test/class/method execution, and this file for the decision history. Link both from [README.md](README.md).
- **Rationale:** Execution steps and reasons for choosing them serve different purposes. Existing architecture guides remain the detailed domain references.
- **Alternatives:** One combined document would mix walkthroughs with historical records; empty files would provide no useful baseline.
- **Consequences:** Maintain these documents alongside relevant changes. This adds documentation only; it does not modify test behavior or install an automatic logging mechanism.
- **Validation:** Source/documentation inspection. No test execution is claimed for this documentation change.

## Template for the next important decision

Copy this template, assign the next unused ID, and add it to the index. Do not leave placeholder text in a completed entry.

```markdown
## DEC-009: Short decision title

- **Recorded:** YYYY-MM-DD.
- **Status:** Proposed / Accepted / Superseded by DEC-XXX.
- **Context:** Problem and constraints; link the test, issue, or code involved.
- **Decision:** Exact behavior or structure selected.
- **Rationale:** Why this choice fits the requirement.
- **Alternatives:** Options actually considered and why they were not selected.
- **Consequences:** Trade-offs, compatibility impact, and any migration needed.
- **Evidence:** Relative links to implementation, plan, or review evidence.
- **Validation:** Commands actually run and results; state clearly if not run.
```
