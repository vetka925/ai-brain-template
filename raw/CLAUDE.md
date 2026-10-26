# `raw/`: exact source records

`raw/<domain>/` holds sources exactly as they were written or said: the owner's notes, dictations, diary entries, drafts, chat statements, and copies of external material that may disappear. Nothing here is interpreted; interpretation lives in `wiki/`.

- One file per source: `raw/<domain>/<YYYY-MM-DD>-<slug>.md` with frontmatter `author`, `title`, `source`, `date`, `domain` ([template](../wiki/_templates/raw-source.md)). Transcriptions add `proofread: false` until the owner reviews them.
- Copy the body exactly: words, spelling, punctuation, order. Add only metadata and paragraph breaks present in the source.
- Never edit a fixed record. A later correction is a separate dated file that links to the original and its evidence.
- Identify the speaker in multi-speaker sources (for example chats with an AI). A model's words are the model's, not the owner's.
- Follow the root privacy rules: no secrets, no material outside the owner's stated boundary.

Each domain directory has its own `CLAUDE.md` of one or two sentences saying what belongs there and any filename rule. Pattern:

```
# `raw/<domain>/`

Store exact <kind of records> here: <examples>. <One filename or metadata rule if the domain needs one.>
```
