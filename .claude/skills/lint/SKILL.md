---
name: lint
description: Audit the AI Brain's structure or source support on explicit request. Read-only; mechanical checks and a bounded semantic review are separate.
---

# Lint

Audit without edits, `last_linted` updates, commits or pushes. Apply fixes only when the owner requests them.

## Choose the scope first

- **Mechanisms audit**: root and domain contracts, skills, templates, settings, tools, startup pages; no unrelated wiki bodies.
- **Mechanical check**: `npm run check:brain` (add `-- --base <commit>` for a change, `-- --all` for the corpus). It checks YAML, metadata, local link destinations, symlinks and budgets; it cannot prove claims, source support, approval or freshness.
- **Source review**: named pages, or at most ten knowledge pages ordered by missing or oldest `last_linted`; include their cited sources in the set. Report the selection before checking and freeze it.

## Semantic checks (selected pages only)

1. Trace factual and attributed claims to the final cited source; compare quotations, numbers, dates and current-state claims exactly. Distinguish source voice, the owner's position and model interpretation.
2. Read raw sources without editing; for live code fetch the named branch; for documents open the stable URL and date the check.
3. Report unsupported claims, inaccurate copies, unresolved dated contradictions, missing originals and unavailable sources. Never promote cached evidence to current fact after an access failure.
4. Age over 30 days is a review candidate, not an error. A model check cannot confer `verified`.
5. In a mechanisms audit, check conditional reading, operation routing and write or approval boundaries; run [behavior scenarios](../../../docs/checks/brain-scenarios.md) after procedure changes and judge observable actions, not keyword presence.

## Output

Scope, counts, unavailable evidence, then findings ordered critical / high / medium / low with path and line, evidence and a concrete fix. Separate demonstrated defects from proposals. Say «no findings» only within the checked scope. Report the checker's budget estimate as a heuristic, never as provider tokens.
