# `wiki/`: knowledge with sources

`wiki/<domain>/` holds summaries, syntheses and interpretations built from `raw/` and from external sources. Every factual or attributed claim leads to its source; the page says what is known, from where, and since when.

- Create a page from [the template](_templates/wiki-page.md); update an existing page instead of creating a near-duplicate.
- Keep dated history inside the page when the fact changes; do not overwrite the earlier record silently.
- Separate the source's voice, the owner's position and the model's interpretation. Mark unsupported inference `[model inference, unverified]`.
- Pages about the owner record what they wrote, did or explicitly said. Do not add a psychological characterization.
- `wiki/meta/` holds the operational pages: profile, conventions, pipelines, reflections, rule proposals. They use `type: operational` and change only with the owner's authorization.

Each domain directory has its own `CLAUDE.md` of one or two sentences saying what the domain summarizes and from which raw sources. Pattern:

```
# `wiki/<domain>/`

Summarize <subject> from `raw/<domain>/` and <external sources>. <One domain-specific rule, for example how to treat people or dates.>
```
