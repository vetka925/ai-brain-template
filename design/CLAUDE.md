# `design/`: working packages

`design/<slug>/` holds the changeable files of one piece of work until it is finished or decided: plans, drafts, prototypes, reports. These files are neither sources (`raw/`) nor settled knowledge (`wiki/`).

- Every Markdown file here starts with `authorship:` frontmatter (format in `wiki/_templates/wiki-page.md`); the checker requires it.
- One directory per task or project change. Keep the current state only in `STATE.md`: stage, decisions with dates, what is next, what waits for the owner. A new session continues from it.
- Give the package one reader entry point (`README.md` or `report.md`): the problem, what was done, findings, what the owner should try or decide. Technical evidence and history go behind links, not into competing final reports.
- Scale the package to the task; do not add files to fill a template. One file needs no index.
- When a decision is made, summarize it in the relevant `wiki/` page with the package as source; keep the directory as history.
- `design/install/` and `design/import/` are created by the installer and record installation and import state.
