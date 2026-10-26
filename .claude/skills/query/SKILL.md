---
name: query
description: Answer from the AI Brain with source citations. Use for «what do we know», «remember», «find in my notes», and silently when recorded context could materially change a substantive answer. Skip for trivial replies and unrelated general facts.
---

# Query

Follow the root rules for personal context, evidence, privacy and current information. The question is the search scope; distinguish an explicit query from a silent context check. A query is «Do now» and read-only: no cards, no saved report. Use `deep-research` and the «Find out and report» pipeline only when the owner asks for a research deliverable.

## Procedure

1. For a known topic search its path directly; otherwise use `index.md`. Open only the nearest relevant pages. Read tasks for current work and log for recent changes only when needed. For «continue» or «what next», use the conversation first, then the Active threads at the top of `tasks.md` and the newest `log.md` entries; if still ambiguous, ask one specific choice.
2. Follow wiki citations to the `raw/` file, live original or dated statement. For a current external fact, open the live source and state the date checked.
3. If that route is incomplete, run a targeted case-insensitive `rg` across `index.md`, `wiki/`, `raw/`, `tasks.md`, `log.md` with names, aliases, distinctive phrases and likely spellings. Inspect matches and follow their citations.
4. Say that information is absent only after step 3, naming the paths and terms checked.
5. Cite a repository source by path and line, an external source by URL and date checked. Separate recorded facts, the owner's position, inference and conflicting dated evidence.
6. In a silent context check, use a retrieved connection only when it changes the answer; do not mention it to show it was found.
7. Keep the query read-only. Preserve an answer only on explicit request, carrying its sources into the page.

## Stop conditions

- The final source is unavailable: state the limitation; do not claim its current state is known.
- Sources contradict: report the disagreement and the missing fact that would resolve it.

## Result

A sourced answer, a bounded «no matching record found», or a statement that the current source could not be verified.
