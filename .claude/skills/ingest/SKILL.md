---
name: ingest
description: Integrate a source or a dated operational decision into wiki/ on request. Use capture first for the owner's authored thoughts or requested verbatim wording.
---

# Ingest

Follow the root contract and the domain instructions.

## Required input

One identifiable source: a completed `raw/` file, a reachable external original, or a dated operational statement from the owner. For code: the claim to verify and the module or file boundary; a whole repository is not one source. For a ticket or document: the owner's named fact or topic, else the main subject or decision.

## Procedure

1. For the owner's thought or requested verbatim wording, run `capture` first. A dated operational fact goes directly here.
2. Read the source itself, not an existing summary. A `raw/` file in full; living code from the named branch; a ticket or document at its stable URL, recording the date read. Record every source in the root format.
3. Leave `raw/` unchanged, except: a source that will disappear gets one exact copy in `raw/` with its original link and access date.
4. Find the existing wiki pages whose subject the source materially changes or supports. Update them instead of creating duplicates; create a page from [the template](../../../wiki/_templates/wiki-page.md) only when none fits.
5. Write only claims the source supports. Exact values, inference labels, citations, authorship, dated conflicts and `verified` removal after substantive edits follow the root rules. A model's statement about the owner is not a profile fact; the owner's dated statement is.
6. Finish through the root contract's write procedure. Name every changed page and unresolved conflict in the summary.

## Stop conditions

- A live source cannot be reached: stop and say so; do not present a cached summary as current.
- A code source has no defined claim: ask for the boundary before reading.
- A document has several unrelated outcomes and the owner named none: ask which.
- The source identity or date cannot be established: ask.

## Result

Traceable wiki pages that distinguish current facts, dated history and inference; `raw/` unchanged except the disappearing-source case.
