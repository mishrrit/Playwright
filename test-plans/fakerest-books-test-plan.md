# FakeRest API — Comprehensive Test Plan (Books + related resources)

Location: `./test-plans/fakerest-books-test-plan.md`

Overview
- This plan follows the orchestrator's strict planner rules: it includes a snapshot of the Swagger/OpenAPI, a complete endpoint enumeration and mapping table, scenario categorization (`smoke|sanity|regression`), required service-wrapper and fixture artifacts, cross-resource scenarios, and a list of clarifying questions that must be answered before generation.
- Base URL: `https://fakerestapi.azurewebsites.net`
- Swagger JSON snapshot (saved alongside plan): `test-plans/fakerest-swagger-v1.json` (planner MUST fetch `/swagger/v1/swagger.json` and store it here).

Scope
- Cover all API resources surfaced by the Swagger: `Books`, `Authors`, `CoverPhotos`, `Activities`, `Users`.
- Produce categorized scenarios for each resource and cross-resource integration flows.

Goals
- Ensure smoke coverage for each resource (fast happy-paths runnable in PR checks).
- Provide sanity suites for a daily smoke+basic CRUD verification.
- Provide regression suites covering endpoint contracts, edge cases, and seeded cross-resource reads for nightly/releases.
- Enforce service-wrapper + fixture patterns. This demo does not store writes; DELETE is checked as an endpoint, not claimed as persistent cleanup.

Verified FakeRest contract (2026-10-12)
- Live requests across all five resources confirm that POST/PUT echo payloads and DELETE returns 200 without modifying the seeded dataset. ID 0 is echoed on creation but remains absent on GET. Real persisted CRUD cannot be certified against this target; it requires a stateful service and separate lifecycle tests.
- Smoke suites retain list, create, read, and delete calls. Sanity suites additionally verify every echoed update field, reread unchanged seeded values, and verify that the seed still exists after DELETE. Dates are compared as instants to tolerate equivalent JSON date formatting.
- Author/CoverPhoto payloads reference a book selected and verified from the existing dataset, not a POST response falsely assumed to be persisted.
- Negative tests require exactly HTTP 400 with a field-specific validation error for an incorrectly typed known field. They must never accept HTTP 200 or 500. Book `pageCount` is an `int32` in the live OpenAPI; an unknown `bad` property is not a reliable invalid-input case on this server.
- Independent Books cases do not use serial mode: failure of one case must not prevent unrelated negative/edge coverage from executing.
- Reusable assertions live in `api/tests/fakerest/contractAssertions.ts`; local tests in `api/tests/framework/fakerest-assertions.spec.ts` verify that wrong statuses, corrupt echoes, and missing validation errors still fail.

OpenAPI / Swagger
- Source: `/swagger/v1/swagger.json` (planner has fetched and saved a copy at `test-plans/fakerest-swagger-v1.json`).
- The planner enumerated the following resources and operations (paths taken from the Swagger):

Endpoint mapping table

The table below records the original endpoint inventory. Any suggested create/read/delete flow must follow the verified non-persistent contract above; write-dependent relationship scenarios require a stateful target and are not implemented as persistence tests here.

| Resource | Path | Methods | Path params | Request schema | Response schema | Suggested scenarios (category) |
| --- | --- | ---: | --- | --- | --- | --- |
| Activities | `/api/v1/Activities` | GET, POST | — | `Activity` | `Activity[]` / `Activity` | List (smoke), Create+Get+Delete (sanity), invalid payload (regression) |
| Activities | `/api/v1/Activities/{id}` | GET, PUT, DELETE | `id:int` | `Activity` | `Activity` | Get by id (smoke), Update (sanity), Delete (sanity), Get non-existent (regression) |
| Authors | `/api/v1/Authors` | GET, POST | — | `Author` | `Author[]` / `Author` | List (smoke), Create+Get+Delete (sanity) |
| Authors | `/api/v1/Authors/{id}` | GET, PUT, DELETE | `id:int` | `Author` | `Author` | Get/Update/Delete (sanity/regression) |
| Authors (by book) | `/api/v1/Authors/authors/books/{idBook}` | GET | `idBook:int` | — | `Author[]` | Cross-resource: create Book -> create Author with `idBook` -> GET authors for book (regression) |
| Books | `/api/v1/Books` | GET, POST | — | `Book` | `Book[]` / `Book` | List (smoke), Create+Get+Delete (sanity), create invalid (regression) |
| Books | `/api/v1/Books/{id}` | GET, PUT, DELETE | `id:int` | `Book` | `Book` | CRUD flow (sanity/regression), edge numeric/title tests (regression) |
| CoverPhotos | `/api/v1/CoverPhotos` | GET, POST | — | `CoverPhoto` | `CoverPhoto[]` / `CoverPhoto` | List (smoke), Create+Get+Delete (sanity) |
| CoverPhotos (by book) | `/api/v1/CoverPhotos/books/covers/{idBook}` | GET | `idBook:int` | — | `CoverPhoto[]` | Cross-resource: create Book -> create CoverPhoto with `idBook` -> GET covers for book (regression) |
| CoverPhotos | `/api/v1/CoverPhotos/{id}` | GET, PUT, DELETE | `id:int` | `CoverPhoto` | `CoverPhoto` | Get/Update/Delete (sanity/regression) |
| Users | `/api/v1/Users` | GET, POST | — | `User` | `User[]` / `User` | List (smoke), Create+Get+Delete (sanity) |
| Users | `/api/v1/Users/{id}` | GET, PUT, DELETE | `id:int` | `User` | `User` | CRUD flow (sanity/regression) |

Notes
- The planner MUST include the full schema references (components.schemas) for each resource in the saved Swagger snapshot.
- For each operation the plan suggests, include expected status codes (200, 201, 400, 404, 422 etc.) and example payloads derived from the schema.

Scenario catalog (high-level)

- Books
  - TC-BOOKS-001 (smoke): `GET /api/v1/Books` returns 200 and array
  - TC-BOOKS-002 (smoke): list/read seeded books, verify POST echo and absent ID 0, verify DELETE status and seed remains available
  - TC-BOOKS-010 (sanity): non-persistent POST/GET/PUT/DELETE contracts, including full response field checks and unchanged seeded title after PUT/DELETE
  - TC-BOOKS-020 (regression): invalid `pageCount` type -> expect 400 and `$.pageCount` validation error
  - TC-BOOKS-030 (regression): edge title length = 2000
  - TC-BOOKS-040 (regression): pageCount boundary numbers (0 and 2147483647)

- Authors
  - TC-AUTH-001 (smoke): `GET /api/v1/Authors`
  - TC-AUTH-010 (sanity): non-persistent CRUD response contracts using a seeded book reference; strict invalid `firstName` type rejection
  - TC-AUTH-020 (regression): `GET /api/v1/Authors/authors/books/{idBook}` (cross-resource)

- CoverPhotos
  - TC-COV-001 (smoke): `GET /api/v1/CoverPhotos`
  - TC-COV-010 (sanity): non-persistent CRUD response contracts using a seeded book reference; strict invalid `idBook` type rejection
  - TC-COV-020 (regression): `GET /api/v1/CoverPhotos/books/covers/{idBook}` (cross-resource)

- Activities
  - TC-ACT-001 (smoke): `GET /api/v1/Activities`
  - TC-ACT-010 (sanity): Verify non-persistent CRUD endpoint contracts: POST echoes the activity with ID 0, GET 0 returns 404, GET a seeded ID succeeds, PUT echoes updates, DELETE returns 200, and GET after DELETE still returns the original seeded activity. FakeRest writes do not persist; do not assume a create/read/delete lifecycle.

- Users
  - TC-USER-001 (smoke): `GET /api/v1/Users`
  - TC-USER-010 (sanity): non-persistent CRUD response contracts; strict invalid `userName` type rejection

Cross-resource integration scenarios (regression)
- TC-INTEG-001 (planned): Select a seeded Book -> verify `GET /api/v1/Authors/authors/books/{idBook}` returns authors referencing that book. Persisted creation relationships are outside this demo's capabilities.
- TC-INTEG-002 (planned): Select a seeded Book -> verify `GET /api/v1/CoverPhotos/books/covers/{idBook}` returns covers referencing that book. POST echo alone must not be described as a stored relationship.

Required artifacts (per planner rules)
- Save Swagger snapshot: `test-plans/fakerest-swagger-v1.json`
- Service wrappers to create: `api/services/BooksService.ts`, `api/services/AuthorsService.ts`, `api/services/CoverPhotosService.ts`, `api/services/ActivitiesService.ts`, `api/services/UsersService.ts`.
- Fixtures: expose each service via `api/fixtures/apiFixtures.ts` (e.g. `booksService`, `authorsService`, ...)
- Tests: place under `api/tests/fakerest/` with filenames grouped by resource and prefixed by category or date when generated by agent. Each test file must include the plan/scenario ID in metadata.

Implementation constraints
- Tests must clean up created resources whenever feasible; if cleanup is impossible (remote service retains data), document the limitation and request human approval.
- Use the repository `BaseAPI` and existing fixture patterns.
- All generated tests must include a metadata header with: `Location`, `TC-ID`, `Category`, `Plan`, `Author`.
- Tests must assert both HTTP status code and response schema/fields where applicable.

Ambiguities & required clarifications (BLOCKING — must be answered before generation)
1. Prioritization: Should generation produce all resources at once, or prioritize a subset? If prioritized, which resources first? (recommended: `Books`, `Users` as highest priority)
2. Data retention policy: Must tests always delete created resources? If some resources must persist for downstream tests, specify which and for how long.
3. Authentication/Headers: Swagger shows public APIs; confirm if any environment requires API keys or headers for staging/prod.
4. Example payload policy: Should the generator produce random payloads or deterministic factory payloads under `api/test-data/`? (recommended: factories with deterministic defaults and small random suffixes)
5. Rate limits / concurrency: Any known rate-limits to respect? If so, provide limits to avoid test flakiness.

Stage Gate 1 deliverables (planner must present these for approval)
- `test-plans/fakerest-books-test-plan.md` (this document)
- `test-plans/fakerest-swagger-v1.json` (downloaded snapshot of Swagger)
- Endpoint mapping table (included above)
- Scenario list with category and estimated runtime
- Blocking questions list (above)

Stage Gate 1 approval requirement
- The orchestrator must receive an explicit `APPROVE` or `DECLINE` for this plan before the generator creates any tests. Approval must reference the plan file path.

Generation notes (for Stage Gate 2)
- Generator should create service wrappers and fixtures as specified, then generate smoke scenarios first and run them locally to verify.
- Present generated files, diffs, and verification logs for Stage Gate 2 approval before creating sanity/regression suites.

CI guidance
- `smoke` suite: run on PRs and short pre-merge checks.
- `sanity` suite: run on daily builds.
- `regression` suite: run nightly or release pipelines.

Appendix: Example Book payload (derive from Swagger schema)

```json
{
  "id": 0,
  "title": "Integration Test Book",
  "description": "created by automated test",
  "pageCount": 123,
  "excerpt": "",
  "publishDate": "2026-10-08T00:00:00.000Z"
}
```


