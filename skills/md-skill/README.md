# md-skill

Simple Markdown fixer skill. It performs minimal, safe formatting fixes on Markdown files:

- Normalize CRLF to LF
- Remove trailing spaces
- Collapse excessive blank lines to a maximum of two
- Ensure a single trailing newline at EOF

Usage:

```bash
# from repo root
cd skills/md-skill
node index.js
```

When run in CI (GitHub Actions) the script will commit and push any fixes it applies.

