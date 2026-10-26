# AI Brain tools

Reusable maintenance scripts only. They read the repository and write only `log.md` and `log-archive/`. Nothing here sends content anywhere.

```sh
npm ci                                  # once per clone, Node 18+
git config core.hooksPath .githooks     # once per clone: pre-commit budget gate
npm run check:brain                     # mechanisms: YAML, metadata, local links, symlinks, budgets
npm run check:brain -- --base <commit>  # also staged, unstaged and untracked changes since the commit
npm run check:brain -- --all            # whole corpus (may show historical defects)
npm run rotate:log                      # move the oldest log entries unchanged into log-archive/YYYY-MM.md
npm run test:brain                      # tests of the scripts themselves
```

- `brain-check.cjs` verifies frontmatter, required metadata on wiki/design/docs pages, local link destinations, symlinks and size budgets. It cannot verify claims, external URLs, approval or live state. Raw bodies are never parsed. `--json` gives machine-readable output. Exit 1 means findings; exit 2 means it could not run.
- `rotate-log.cjs` moves the oldest `log.md` entries unchanged into monthly archives until the log fits its budget, and points the footer at the newest archive. It refuses an unrecognized layout.
- `brain-budget-hook.cjs --start` runs at session start (Claude Code: `.claude/settings.json`; Codex: `.codex/hooks.json`). It prints one line per startup file at or above 85% of its budget and a reminder when `wiki/meta/reflections.md` has `reviewed:` older than 30 days. It only reports and never blocks.
- `.githooks/pre-commit` blocks a commit only when a staged startup file exceeds its budget.

Budgets (estimate = ceil(UTF-8 bytes / 3), a conservative heuristic, not provider tokens): root `CLAUDE.md` 1,900; `wiki/meta/conventions.md` 2,700; `wiki/meta/profile.md` 700; combined startup 6,000; `tasks.md` 2,800; `index.md` 1,500; `log.md` 2,500; `wiki/meta/reflections.md` 10,000. Change the numbers in `brain-check.cjs` and here together. The budgets exist because every session reads the startup files; a Brain that grows them without limit slowly stops being read.

Scripts that belong to another project stay in that project. Temporary diagnostics stay out of the Brain.
