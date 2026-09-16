---
name: code-review
description: "Use when: reviewing a pull request, checking code changes for bugs, validating implementation against requirements, assessing security or performance risks, or preparing feedback for a teammate. Guides a structured, evidence-based code review workflow for correctness, maintainability, testing, and risk." 
---

# Code Review

## Purpose

Review code changes with a practical, evidence-based workflow. Focus on whether the patch is correct, safe, testable, and aligned with the intended behavior. The review should be useful to both the author and the team, with clear priorities and actionable recommendations.

## When to Use

Use this skill when you need to:
- review a pull request or patch
- evaluate whether implementation matches requirements
- find correctness, security, performance, or maintainability issues
- assess whether tests and validation are sufficient
- provide concise feedback with severity levels and next steps

## Review Workflow

### 1. Understand the change
- Read the title, summary, and problem statement.
- Identify the user-facing behavior, business goal, and expected outcome.
- Check whether the change scope matches the intent; flag unrelated edits or scope creep.
- If the patch is large, review by files and by risk area rather than reading linearly without context.

### 2. Validate the intent and correctness
- Confirm the implementation matches the requirement or bug fix.
- Trace the affected code path and check for edge cases.
- Look for logic errors, null/empty handling, boundary conditions, and incorrect assumptions.
- Verify whether the fix handles the failing scenario and whether it introduces regressions elsewhere.

### 3. Check for code quality and maintainability
- Evaluate readability, naming, complexity, duplication, and clarity.
- Check for hidden coupling, unclear state transitions, and brittle assumptions.
- Prefer to call out design issues that make the code harder to extend or debug.
- Recommend the smallest clear improvement, not broad refactors unrelated to the patch.

### 4. Review security, reliability, and performance
- Look for unsafe input handling, injection paths, auth/authz issues, secret exposure, and unsafe defaults.
- Check error handling, retries, retries with exponential backoff, cancellation, timeouts, and failure modes.
- Review performance-sensitive logic for repeated work, blocking calls, unbounded loops, or large memory use.
- Flag issues that can cause outages, data loss, or user-facing breakage.

### 5. Assess tests and verification
- Verify that the changed behavior is covered by tests.
- Check whether the tests exercise the real scenario, not just mocks or happy paths.
- Ask whether edge conditions, failure paths, and regression scenarios are covered.
- If tests are missing or weak, call it out explicitly and suggest what should be validated.

### 6. Prioritize findings
Classify findings as:
- Must fix: correctness, security, reliability, or regression risk
- Should fix: maintainability, edge-case gaps, or moderate quality concerns
- Nice to have: style, cleanup, or opportunistic improvements

### 7. Provide actionable feedback
Each review comment should include:
- problem summary
- why it matters
- affected area or example
- a suggested fix or direction

Use concise but specific language. Avoid vague comments like “this looks wrong” without evidence.

## Decision Points

- If the change is a bug fix, focus first on root cause and backward compatibility.
- If the change is a feature, check requirements coverage, data flow, and error handling.
- If the code is not testable, flag the missing validation rather than accepting it silently.
- If there is not enough context, ask for the requirement, PR description, or failing scenario before finalizing the review.
- If a concern is purely stylistic and not risky, keep it low priority or mention it as optional.

## Completion Criteria

A review is complete when:
- the change scope is understood
- correctness risks are checked
- security/reliability/performance concerns are reviewed
- tests and verification are evaluated
- findings are prioritized and actionable
- positive notes are included where appropriate

## Review Output Template

Use this format when summarizing the review:

- Overall assessment: approve / approve with comments / request changes
- Key strengths: brief summary of what is working well
- Findings:
  - [Must fix / Should fix / Nice to have] Description, impact, and recommendation
- Validation: note any tests or checks performed or missing

## Anti-Patterns to Avoid

- Don’t approve without checking the actual behavior or changed code paths.
- Don’t focus only on style while ignoring correctness or security.
- Don’t make broad architectural rewrites unless they are necessary for the change.
- Don’t leave comments without clear reasoning or a specific action.
- Don’t treat test gaps as acceptable if the change affects behavior.

## Example Prompts

- “Review this PR for correctness and security risks.”
- “Check whether this change matches the requirement and identify any regression risks.”
- “Review this patch for test coverage and missing edge cases.”
- “Assess this code for maintainability and reliability concerns.”
