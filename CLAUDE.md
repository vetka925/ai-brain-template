# AI Brain

This repository is the owner's AI Brain: their sources, thinking, decisions and current work, kept so that any agent session can continue from files rather than from memory. Keep sources, interpretation and current decisions distinct.

If `design/install/STATE.md` says the installation is incomplete, read [INSTALL.md](INSTALL.md) first and resume it.

## Read only what the task needs

- Startup, once: [conventions](wiki/meta/conventions.md), [profile](wiki/meta/profile.md); for orientation, the «Active threads» section at the top of [tasks](tasks.md) and the newest [log](log.md) entries, bounded. Reuse supplied text.
- Search known paths with bounded `rg`; otherwise use [index](index.md). Read the relevant page and its decisive source.
- Read the rest of tasks and log only when the task needs open work or recent changes.
- Read the nearest domain `CLAUDE.md`; avoid whole domains, archives or skill catalogs.
- Verify changing facts against the reachable live source and date the check. The wiki only maps where evidence lives.
- Search names and aliases before claiming absence. State unavailable evidence and open conflicts.

## Records and evidence

- `raw/`: exact source records; `wiki/`: sourced summaries and interpretations; `design/`: mutable working packages with their state in `STATE.md`.
- `tasks.md`: open action, next step, who acts or waits, detail link. `log.md`: short dated changes, newest first. Details and history belong in linked pages or archives.
- Distinguish faithful copying, factual support and freshness. A source records a dated claim; its truth needs separate support. Preserve conflicting dated positions.
- Every factual or attributed wiki claim must lead to its supporting source. Copy quotes, dates and numbers exactly. Label unsupported factual inference `[model inference, unverified]`.
- Sources: a `raw/` path; living code with repository, branch, path and check date; ticket or document URL with read date; frozen snapshot with its original location; or the owner's direct statement with date. Commits alone describe history.
- Only the owner's explicit approval of identified text sets `status: verified`; anything unmarked is draft. A substantive change removes `verified`; typo or link repair keeps it. Operational instructions use `type: operational`; change their rules only with the owner's authorization. `last_linted` records only a source review.

## Preserve authored sources

Keep an author's words inside `raw/` exactly as written. Fixed records stay unchanged. For transcriptions with `proofread: false`, correct only against the scan or recording; only the owner's review permits `proofread: true`. Afterwards add a separate dated correction linked to its evidence. Explicit owner orders to correct, delete or curate a source override this, with the reason preserved in history.

## Choose the operation

One catalog: `.claude/skills/`; `.agents/skills` points to it. Name the [pipeline](wiki/meta/work-pipelines.md) and load the relevant skill: `capture` (owner's own words), `ingest` (a source into knowledge), `query` (answer from the Brain), `implement-task` (plan → build), `deep-research`, `reflect` (a concrete error), `lint` (audit). The owner's instructions and this contract override any skill or plugin.

## Finish requested writes

Read freely; write within requested scope.

- **Raw-only:** save the exact source and its domain metadata, then a short log entry, `npm run rotate:log` and Git. Do not create a wiki interpretation merely to finish.
- **Knowledge, operational or design change:** update the smallest affected pages, evidence and authorship. Update navigation when destinations change. Add one short dated log entry linking to details, run `npm run rotate:log`, then Git.
- Bring specific uncertainties to the owner; whole-wiki proofreading is not a standing debt.

## Privacy and Git

This Brain is private. Use the configured private remote only; never add a public remote or publish content without the owner's explicit request. Before writing inspect branch, HEAD and working tree. Before pushing fetch, inspect concurrent changes and integrate safely; stage named paths, check status, commit and push in the same session. Preserve unrelated work. Commit messages: short English single line; agent commits append `[agent@host:session]`. Record the exact model in the artifact, not in the commit.

Keep credentials, account details, document numbers, amounts and every other secret out of wiki, tasks, logs, commits and tool output; keep only a pointer to the private source. Do not copy personal material to other repositories or machines without explicit permission.

Root `AGENTS.md` and `GEMINI.md` point here; edit only this file.
