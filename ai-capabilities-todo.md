AI Capabilities TODO
=====================

Overview
--------
This file lists suggested AI-driven capabilities to add to the Playwright test framework. Each entry includes: What / Why / How, recommended tasks, and phased priority so you can pick work in iterations.

Phase 1 — Quick wins (low friction)
----------------------------------
- [ ] Natural-language failure summaries
  - What: Generate concise, human-readable summaries for failed tests (repro steps, root cause hints).
  - Why: Speeds triage and reduces debugging time.
  - How: Aggregate logs, stack traces, screenshots, console output; call an LLM to compose a short summary; attach to Allure/Playwright report.
  - Tasks:
    - Add failure-collector reporter hook
    - Implement LLM summarization call (configurable provider)
    - Attach summary to report and CI job

- [ ] Smart selector / locator suggestions
  - What: Propose robust selectors and fallback locators for brittle tests.
  - Why: Reduces fragility from UI changes.
  - How: Snapshot DOM at failure, run heuristics + LLM to propose `data-testid`/stable CSS/XPath and ranked fallbacks; offer a patch.
  - Tasks:
    - Create DOM snapshot exporter
    - Build suggestion CLI and reporter integration
    - Provide one-click replace patch generator

- [ ] Visual regression with semantic diffing
  - What: Perceptual diffs that classify changes (layout, color, content).
  - Why: Fewer false positives; find meaningful UI regressions.
  - How: Use perceptual hashing + image-diff + simple vision model; attach annotated images to reports.
  - Tasks:
    - Add screenshot baseline manager
    - Integrate perceptual diff library
    - Add classifier and annotated output in report

Phase 2 — Mid-term (more telemetry + automation)
-------------------------------------------------
- [ ] Flakiness detection & root-cause analysis
  - What: Detect flaky tests and classify probable cause (timing, network, animation, test-data).
  - Why: Improves CI signal and reduces manual debugging.
  - How: Collect retries, historical runs, logs, screenshots; train or use heuristics plus LLM for classification and suggested fixes.
  - Tasks:
    - Persist run history (lightweight DB)
    - Build flakiness classifier and report UI
    - Link suggestions to PRs or issues

- [ ] Automated test maintenance / auto-fix
  - What: Propose and optionally apply fixes for failing tests (locator updates, waits, assertions).
  - Why: Reduces maintenance burden, faster recovery from regressions.
  - How: Generate candidate patches from LLM + repo context; validate in isolated runner before applying.
  - Tasks:
    - Implement patch generator and sandbox runner
    - Add review UI and safe auto-merge option

- [ ] Smart assertion generation
  - What: Suggest assertions based on page state and common invariants.
  - Why: Helps authors add meaningful checks, increases coverage.
  - How: Inspect DOM and flows to infer invariants; propose assertion snippets for review.
  - Tasks:
    - Implement page state inspector hook
    - Build suggestion CLI and template insertion

- [ ] Test data and fixture generation
  - What: Produce realistic test data and mocks respecting schemas and privacy.
  - Why: Reduces manual fixture creation and improves edge-case coverage.
  - How: Use prompt-driven generators or small synthesis models to produce seeds, JSON payloads, and mocks.
  - Tasks:
    - Add generator CLI and schema-aware templates
    - Wire into fixture loader

Phase 3 — Strategic / advanced
------------------------------
- [ ] Test prioritization and impact analysis
  - What: Rank tests to run based on code changes and historical impact.
  - Why: Faster CI feedback and resource savings.
  - How: Compute embeddings for tests and code changes; select high-impact subset to run in PRs.
  - Tasks:
    - Build embedding pipeline and metadata store
    - Integrate with CI job selector

- [ ] Natural-language test generation
  - What: Convert user stories or plain-English scenarios into runnable Playwright tests.
  - Why: Speeds authoring and empowers non-dev stakeholders.
  - How: LLM generates TypeScript Playwright test scaffold; run lint, static checks, and sandboxed test run.
  - Tasks:
    - Create generator CLI
    - Add safety/validation runner
    - Store mapping of spec -> generated test

- [ ] Accessibility regression detection + fixes
  - What: AI-aided accessibility checks with proposed HTML/attribute fixes.
  - Why: Prevent regressions and improve inclusivity.
  - How: Run axe-core, feed issues to LLM to prioritize and propose concrete fixes or test assertions.
  - Tasks:
    - Add axe integration and report enrichment
    - Provide suggested patch output for simple fixes

- [ ] Performance regression alerts
  - What: Detect regressions in loading and rendering metrics and provide summaries.
  - Why: Prevents UX degradation and catches perf regressions early.
  - How: Capture metrics (TTFB, LCP, FCP), baseline them, run anomaly detection and produce LLM summaries.
  - Tasks:
    - Add metric capture into test flows
    - Persist baselines and alerts in CI

Implementation priorities & starter tech
--------------------------------------
- Quick wins first: failure summaries, smart selectors, visual regression.
- Mid-term: flakiness detection, auto-fix, assertion generation.
- Strategic: test prioritization, NL test generation, perf & accessibility pipelines.

Suggested stack
- TypeScript-first: place helpers under an `ai/` folder as TypeScript (`.ts`). Use `ts-node` for local development and add a `tsc` compile step for CI. Example helper files: ai/generate-summary.ts, ai/nl-failure-reporter.ts.
- Integration layer: add `ai/` folder and small service/CLI in TypeScript (Node) alongside Playwright.
- Persistence: SQLite or simple JSON store for initial telemetry; optional vector DB (Milvus/Weaviate/pgvector) for embeddings.
- Models: LLM via configurable provider (OpenAI/Foundry/Local LLM); vision steps using `pixelmatch` / `resdiff` or lightweight vision models.
- Reporting: enrich existing `allure` reports and Playwright reporters; add a CLI to accept or apply suggested patches.

How to pick a first task
------------------------
1. Start with `Natural-language failure summaries` or `Smart selector suggestions` — low engineering overhead and high value.
2. Build a small `reporter` integration and a CLI that calls an LLM (mockable) so you can iterate without costs.

Notes
-----
- Keep any LLM calls behind a configurable adapter so you can swap providers or disable during CI.
- Respect privacy: scrub PII before sending payloads to external models.
- For any auto-apply behavior, always require a reviewed opt-in flag.

If you want, I can scaffold the `Smart selector / locator suggestions` feature (reporter + DOM snapshot exporter + suggestion CLI).
