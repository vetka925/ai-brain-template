---
type: "" # entity | concept | summary | reference | operational
status: draft # draft | verified (only after the owner's approval of identified text)
sources: [] # raw path; URL with read date; "Owner, YYYY-MM-DD: statement"
last_linted: "" # date of the last source review, set only by lint
authorship:
  - kind: model # model | human
    model: "" # exact session model; "unknown (exact model not recorded)" if not exposed
    provider: ""
    program: ""
    contribution: "" # "YYYY-MM-DD: what"
---

# Title

Summarize only supported claims; link each to its source. Mark unsupported factual inference `[model inference, unverified]`. Keep dated history when a fact changes.

## Authorship

Keep the latest substantive contribution per contributor in `authorship`; humans add `name`, models add the exact model. A log entry records the responsible model for each change. Pre-existing text keeps its author.
