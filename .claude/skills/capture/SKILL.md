---
name: capture
description: Record the owner's own dictated or drafted words in raw/ when they ask to preserve them — an idea, reflection, diary entry, reading note, draft. Use ingest instead for a ready operational fact or decision.
---

# Capture

Follow the root contract and the instructions of the chosen `raw/` domain.

## Required input

The owner's words or the primary medium to transcribe (scan, recording). Their date and title; if absent, the known authorship date or today, and a short neutral phrase from the text.

## Procedure

1. Confirm the material is the owner's authored voice. A dated operational fact or decision goes directly to `ingest`, unless the owner asks to preserve the wording itself.
2. Choose one existing domain from the main subject; `ingest` connects it to others later.
3. Copy the body exactly: no changed words, spelling, punctuation, order or meaning. Add only metadata and paragraph breaks present in the source.
4. Name the file `raw/<domain>/<date>-<slug>.md` unless the domain's `CLAUDE.md` defines its own rule. If the path exists, stop and show the collision; never overwrite.
5. Add the domain's metadata; at least `author`, `title`, `source: capture`, `date`, `domain` ([template](../../../wiki/_templates/raw-source.md)).
6. For a transcription, mark unreadable text `[illegible]`, mark uncertain readings, set `proofread: false`.
7. For «save this thought», run `ingest` on the new file afterwards. Stop after capture only when the owner asks to keep only the source.
8. Finish through the root contract's **Raw-only** or **Knowledge change** branch.

## Stop conditions

- Ask for the missing text or medium when accurate capture is impossible without it.
- Ask before creating a new domain when none fits.

## Result

One exact, traceable source in the right `raw/` domain, without interpretation.
