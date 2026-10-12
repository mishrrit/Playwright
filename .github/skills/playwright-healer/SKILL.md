Name: Playwright Healer Invoker

Description:
- A workspace skill that detects failed UI or API Playwright test runs, summarizes failures, prompts for human consent, optionally asks clarification questions, and then (with consent) invokes the `playwright-healer` agent or configured heal command.

When to use:
- After running Playwright tests locally or in CI when one or more tests fail under `ui/` or `api/`.

Behavior:
1. Scan the repository `test-results/` (and `allure-results/`) for failure artifacts (folders with `error-context.md` or other failure traces).
2. Summarize failures and present a concise list to the human operator.
3. Ask for explicit human consent before any automated action.
4. If there is ambiguity about what to heal next, the skill asks one follow-up question and accepts freeform input from the human.
5. On consent, the skill writes a `healer-request.json` with the selected failures and invocation parameters and then prints the agent invocation command for CI or operator to run. If `HEALER_RUN_CMD` is set in the environment, the script can optionally execute that command (only after consent).

Files produced by the skill:
- `.github/skills/playwright-healer/SKILL.md` (this file)
- `.github/skills/playwright-healer/run-healer.js` (helper CLI)

Consent & Safety:
- The skill never runs the healer agent without explicit yes/no consent typed by a human in an interactive terminal.
- In CI, the skill prints the recommended agent invocation and writes a `healer-request.json`; automated invocation in CI should only be enabled when the org accepts the risk (by setting `HEALER_AUTO_RUN=true` and `HEALER_RUN_CMD`) and an approver approves that workflow.

Integration points / CI snippet (GitHub Actions):
- Add a post-test step that runs when the test job fails and calls the helper. Example snippet:

```yaml
- name: Run Playwright tests
  id: playwright
  run: npm test --silent

- name: Offer Healer for failures
  if: failure()
  run: |
    node .github/skills/playwright-healer/run-healer.js --results-dir=./test-results
  shell: bash
```

CLI usage (local):

```bash
# basic (interactive) scan and prompt
node .github/skills/playwright-healer/run-healer.js

# specify a results directory
node .github/skills/playwright-healer/run-healer.js --results-dir=./test-results

# If you want the script to execute a configured healer command after consent set an env var
HEALER_RUN_CMD="npx copilot runSubagent --agent=playwright-healer --payload=healer-request.json" node .github/skills/playwright-healer/run-healer.js
```

Notes for maintainers:
- Keep the runner script lightweight and avoid embedding secrets. If you want full automatic invocation in CI, gate it behind an approvals step or a protected workflow.
- The helper writes `healer-request.json` so external automation can pick it up and run the agent with appropriate credentials.
