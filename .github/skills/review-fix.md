---
name: review-fix
description: "Use when: a pull request or code change has review comments that need to be addressed, there are actionable fixes to implement, or comment feedback needs to be converted into code changes. Reads all review feedback, prioritizes fixes, asks the human for confirmation before changing code, and respects human precedence when comments conflict or are unclear."
---

# Review Fix Workflow

## Purpose

Turn review comments into safe, minimal, and correct code changes. The workflow must be evidence-based, consistent with repository norms, and explicitly human-driven when there is ambiguity or conflict.

## When to Use

Use this skill when you need to:
- read all review comments on a PR or patch
- identify actionable issues and required fixes
- reconcile conflicting feedback
- implement code updates based on team review norms
- ensure the human approves any fix before the code changes are applied

## Mandatory Rules

- Human-in-the-loop has top priority.
- If reviewer comments conflict, are ambiguous, or appear to violate project goals or existing conventions, stop and ask the human for explicit direction before making changes.
- Always ask for confirmation before applying the fix.
- Do not infer intent when the requirement is unclear; ask a targeted question instead.
- Prefer minimal, review-aligned changes over broad refactors.
- Preserve existing project patterns, tests, and coding standards.

## Review Workflow

### 1. Collect and read all review comments
- Read every comment, including summary notes, inline feedback, and request-level concerns.
- Group them by theme such as correctness, maintainability, test coverage, naming, security, or performance.
- Separate actionable feedback from stylistic or optional suggestions.

### 2. Classify the feedback
- Must fix: correctness, regression risk, security, broken behavior, invalid assumptions.
- Should fix: quality, maintainability, edge-case handling, incomplete coverage.
- Nice to have: style or cleanup items that are not necessary for correctness.

### 3. Check for conflicts or uncertainty
- Look for contradictions among comments.
- Identify feedback that is unclear, incomplete, or missing the expected outcome.
- Determine whether the issue requires additional context from the author or reviewer.

### 4. Ask before applying any fix
Before any implementation work, present:
- the review comments being addressed
- the interpretation of the requested change
- the proposed fix strategy
- any conflicts or assumptions that need a decision

Then ask the human for approval or direction.

### 5. Apply the minimal valid fix
Once the human confirms direction:
- implement only the required fix
- keep the patch scoped to the review concern
- avoid unrelated cleanup unless it directly supports the fix
- preserve existing patterns and logic where possible

### 6. Validate the result
- Run the most relevant validation available, such as targeted tests, lint checks, or build verification.
- Confirm the change resolves the requested issue without obvious regressions.
- Note any remaining risks or gaps if validation is limited.

### 7. Summarize the outcome
Provide a clear summary including:
- what was reviewed
- what was changed
- what was left unresolved
- any open questions or follow-up needed

## Decision Points

- If comments are consistent and clear, fix them after confirmation.
- If comments conflict, defer to the human and ask which instruction has precedence.
- If a reviewer request is unclear, ask for an example or expected behavior before changing code.
- If a suggested fix is risky or unnecessary, explain the concern and ask the human whether to proceed.
- If there are no actionable comments, do not make changes.

## Completion Criteria

A review-fix task is complete when:
- all review comments are reviewed
- each relevant comment is classified and interpreted
- the human has approved the fix plan or provided a final decision
- the code is updated only after confirmation
- the change is validated with the smallest relevant check
- any unresolved items are clearly reported

## Review Fix Output Template

- Review summary: list of comments reviewed
- Planned interpretation: how the comments are being understood
- Conflicts / ambiguity: note any issues requiring human direction
- Human decision: confirmation received or pending
- Applied fix: what changed
- Verification: tests/checks run and outcomes
- Remaining items: unresolved or follow-up concerns

## Example Prompts

- “Read all review comments on this PR and propose the exact fixes, but ask me before making any code changes.”
- “Resolve the review feedback in this branch and stop whenever the comments conflict or need a human decision.”
- “Apply only the actionable review suggestions after my approval, and keep the patch scoped to the requested changes.”
- “Interpret the code review notes, highlight ambiguity, and ask me before updating the implementation.”
