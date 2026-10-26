---
name: deep-research
description: Produce a source-based research report through scoped searches, close reading, counterevidence and inline citations. Use for research, literature or market reviews, disputed questions and comparisons that need more than a quick lookup.
---

# Deep research

Answer the actual question, not the search terms. Conclusions are determined by sources and arguments; agreement between models or subagents is not evidence. Open the sources themselves; a search snippet is not evidence. Runs in the «Find out and report» pipeline: start card, work, result card.

## Scale, chosen before searching

| Scale | Use when | Coverage |
|---|---|---|
| Focused | one narrow, low-stakes question | 2–3 angles; ~5–8 strong sources |
| Standard | several parts or a disputed claim | 3–5 angles; ~8–15 |
| Extended | broad, novel or high-stakes | 5–8 angles; 15–30 when they add distinct evidence |

Ask up to three questions only when an omitted limit (use, time horizon, region) would change the answer; otherwise state the assumption and continue.

## Evidence standards

Empirical, technical, legal, medical, financial: current primary sources (data, standards, papers, product documentation); check dates, versions, method and sample; independent support for central contested claims, where pages repeating one origin count as one source.

Humanities: separate the primary text, scholarly interpretation and your own inference; verify quotations against a reliable edition; preserve serious rival readings and judge them by textual coverage, historical fit and explanatory power; use `well supported` / `plausible` / `speculative` instead of numeric confidence.

Always include at least one search aimed at contradiction. For every conclusion that could change the answer, find the strongest credible objection and narrow the wording to what the evidence supports. Conflicting sources are reported as a conflict with what would resolve it.

Use cheaper models or deterministic tools for routine extraction; pilot a small sample before bulk annotation; reuse saved observations when resuming.

## Stop deliberately

Stop when every central conclusion is supported or marked unresolved, the strongest counterevidence was examined, two consecutive targeted searches add nothing, and the scale is satisfied or further work is blocked. An unresolved question is a valid result.

## Report

Lead with the answer; order evidence to explain the issue, not to list sources. Citations next to the claims they support, with the exact page or document and the date checked for time-sensitive sources. Distinguish sourced fact, reported interpretation and your own inference. For medical, legal or financial topics say the report is informational, not professional advice. Save the report in `design/<slug>/` with `STATE.md`; the owner accepts from the result card.
