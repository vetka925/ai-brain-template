---
name: implement-task
description: "Use when the owner asks to implement, build, set up or configure something that needs a plan before work — a project change, infrastructure, tooling, a personal project. Runs the «Plan → build» pipeline: start card, build, evidence, result card. Not for one-sentence fixes (do them directly)."
---

# Plan → build

Pipeline, gates, timeout and helper roles: [work-pipelines](../../../wiki/meta/work-pipelines.md). This skill is the procedure.

Keep the working state in `design/<task-slug>/STATE.md`: stage, gate decisions with dates, timeout, models used, checks run. A new session continues from it.

## 1. Start card (gate 1)

Send the start card from work-pipelines and wait; the timeout rule applies. A «Go» already given in the conversation covers the scope. Write `plan.md` for yourself, at most one page:

- **Goal**: what will work afterwards, in the owner's terms.
- **Approach**: how, and the main alternative rejected with one reason.
- **Steps**: numbered, each with an observable result.
- **Forks**: decide them from the facts in the plan; leave the owner only irreversible or external choices.
- **Check and demo**: exactly what the owner will see or try at the end.
- **Risks and limits**: what can go wrong; every irreversible or external action named.
- **Decision log**: empty, filled during the build.

## 2. Build

- Isolated branch or worktree for code; one writer.
- Everything happens in this session. Helpers (subagents or another vendor's CLI as a subprocess) only read: research, tests, one review when you want it for a concrete uncertainty; findings go into the result card, no fix loop.
- Decide forks yourself from records, live systems and defaults; record the choice and reason in the decision log. Ask the owner only before irreversible or external actions. A material change of meaning returns to gate 1.
- Use the project's own instructions and test discipline for code; for user-facing changes check the real interface, not only tests.

## 3. Evidence report

`report.md`, at most one page: what works now shown by real output (command results, screenshots, links), what failed or was skipped and why, decisions taken and reasons, what the owner should try and decide. No model accepts the result.

## 4. Result card (gate 2)

Send the result card with something to try. Only the owner accepts. Publication, messages to people, shared repositories and deployment happen after their explicit yes.

## Finish

Update `STATE.md`, the task in `tasks.md`, one log entry, commit and push by the root contract.
