# Markdown Fixer Skill

This skill documents how to automatically lint and fix Markdown files in this repository.

It replaces the previous executable `index.js` implementation — all steps to reproduce the same behaviour are contained below and are safe to run locally or in CI.

What the skill does
- Run `markdownlint` auto-fixes using the repository ruleset (`.markdownlint.json`).
- Normalize line endings (CRLF -> LF), trim trailing whitespace, collapse more than 2 consecutive blank lines into 2, and ensure a single trailing newline at end-of-file.
- Stage and commit tracked changes (so CI can push fixes back). The CI job should run with checkout credentials.

Local usage (from repo root)

1. Run markdownlint fix:  

```bash
npx markdownlint-cli --fix "**/*.md" --config ./.markdownlint.json --ignore-path ./.markdownlintignore
```

2. Run the normalization pass (POSIX shell / macOS / Linux):

```bash
# find markdown files and run a perl-based normalization in-place
find . -name "*.md" \
  -not -path "./node_modules/*" \
  -not -path "./playwright-report/*" \
  -not -path "./test-results/*" \
  -print0 | \
  xargs -0 -n1 perl -0777 -i -pe 's/\r\n/\n/g; s/[ \t]+$//mg; s/\n{3,}/\n\n/g; chomp; $_ .= "\n";'
```

3. Stage & commit tracked changes (optional):

```bash
git add -u
git commit -m "chore(md-skill): fix markdown formatting" || true
```

Notes for Windows (PowerShell)

Use `npx` as shown above. For the normalization step, either run WSL / Git Bash, or use the included Node one-liner variant:

```powershell
Get-ChildItem -Recurse -Filter *.md | ForEach-Object {
  $text = Get-Content -Raw -Encoding UTF8 $_.FullName
  $text = $text -replace "\r\n","\n"
  $text = ($text -split "\n") | ForEach-Object { $_ -replace "[ \t]+$","" } -join "\n"
  $text = [System.Text.RegularExpressions.Regex]::Replace($text, "\n{3,}", "\n\n")
  if (-not $text.EndsWith("`n")) { $text += "`n" }
  Set-Content -LiteralPath $_.FullName -Value $text -Encoding UTF8
}
```

CI usage

The repository workflow can run the above commands and commit tracked changes back. Example commands used in CI (GitHub Actions) are shown in the workflow in `.github/workflows/md-skill.yml`.

If you'd like the skill to be executable as-a-service, we can restore a small script (Node or shell) — but per your request this skill is now only a documentation file that contains the exact commands to run and the recommended workflow.
