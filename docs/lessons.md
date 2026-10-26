---
authorship:
  - kind: model
    model: claude-fable-5-1
    provider: Anthropic
    program: Claude Code
    contribution: "2026-10-26: lessons distilled from the source Brain's dated decisions and audits"
---

# What we learned running an AI Brain

This package is not a theory of personal knowledge management. It is what one person's AI Brain looked like after about four months of daily use with two agent tools (Claude Code and Codex), across professional product work, research, personal projects and life records, with its automation layer removed. Every rule in the template came from something that failed or something that visibly worked. This page tells which, with dates, so you can judge what to keep. Private details are left out; the mechanisms are not.

## 1. Memory is files the agent reads, not a folder the agent has

The first lesson, and the one every later rule serves: an agent remembers only what it actually opens in the current session. A rich archive does nothing if the session loads the wrong pages, or too many. So the Brain has a small fixed **startup set** (root contract, conventions, profile, the top of tasks and log) with byte budgets enforced by a script, and everything else is reached by **routes** in `index.md` and by targeted search. The budgets are not decoration: the startup files drifted above their limits for weeks while a warning printed in every session and nobody acted (observed 2026-09-23 to 2026-10-07). The warning was then backed by a pre-commit gate that blocks the commit. A warning without an action attached does not work.

## 2. Separate the owner's words from the model's interpretation

`raw/` holds the owner's own words exactly; `wiki/` holds summaries that cite them. This separation was the single most valuable structure: an audit on 2026-10-07 found that a whole investigation of the automation layer could be reconstructed from log entries alone, because each one pointed to its evidence. It also protects the owner from a subtle harm: a model paraphrase that slowly replaces what they actually thought. The rule «never edit a fixed record; add a dated correction» exists because transcriptions of handwritten diary pages were being «improved» by helpful agents.

The same separation applies to chats with an AI: the model's proposal is not the owner's decision, and an old plan is not a current task. This is why the installer treats imported chats as two-speaker sources.

## 3. Every claim leads to a source, and freshness is separate from truth

A page records that someone said something on a date. Whether it is still true is a separate question, answered by opening the live source and writing the check date. Agents repeatedly reported stale status as current (ticket states, deployment states, code behavior) because a wiki summary existed. The contract therefore says: the wiki only maps where evidence lives; verify changing facts against the live source and date the check; say plainly when the source is unreachable instead of presenting cached data as current.

## 4. The owner's time is the expensive resource, and reports were the waste

The most painful lesson came from the automation experiment. Between 2026-10-07 and 2026-10-13 a task board ran 29 agent tasks with model reviewers checking each result; nine were sent back by reviewers, zero were accepted by the owner, and two independent expert-model reviews passed a result the owner rejected. The reports were unreadable without the agents' chat history, and the reviewers did not notice. The decision on 2026-10-13: **only the owner accepts a result**, from a one-screen **result card** (task and why, result and where to open it, one real example, what to decide), and model review is the lead's own optional choice for code going somewhere shared, one pass, no fix loop. «Model agreement proves nothing» is written into the pipelines because it was measured.

The same week also showed where the budget is really lost: on a misread brief, not on execution. Hence the **start card**: the owner approves the frame and the appetite before work, not the course of the work. The cheapest control point is the first one.

## 5. One task, one session, one context

Splitting a task across helper sessions (a planner, an executor, a checker, a merger) multiplied handoffs and lost context; the owner's words on 2026-10-13 were «one task, one executor, one session; one context for the whole task». Helpers still exist, but as read-only subagents or subprocesses inside the lead's session: research, tests, a single review. The lead integrates and answers for the result. This is simpler and, in practice, produced more finished work.

## 6. Pipelines: name the kind of work before starting it

Three pipelines cover everything that came up: **Do now** (a one-sentence change, no gates), **Plan → build** (start card, build with a plan and state file, evidence report, result card), **Find out and report** (the same two gates around research). Naming the pipeline in the first reply stopped a recurring failure where a «quick fix» silently became a design decision nobody had approved. A task that outgrows its pipeline stops and moves up.

## 7. State lives outside the session

Sessions end, contexts compact, tools crash. Everything needed to continue is in files: `tasks.md` for open actions and who is waited for, `design/<task>/STATE.md` for a task's stage and decisions, `log.md` for what changed, Git for history. A new session that cannot continue a task from these files is a bug in the files, not in the session. The installer's acceptance test is exactly this: a fresh session must find the profile, the current work and a source, and save a record by the rules.

## 8. Authority by risk class, questions in a fixed form

Agents asked too much about reversible things and too little about irreversible ones. The fix was a four-class rule: reversible internal work is simply done; a choice between options is taken with the reason recorded; external or irreversible actions (publication, messages, shared repositories, money, deletion) are prepared but not executed without a «yes»; access problems get one recovery attempt and then one precise message. Questions to the owner start with «Needed from you: one action» and contain everything required to decide. A question without a ready decision inside is a cost, not a courtesy.

## 9. Reflections help only when they change a procedure

The Brain kept a journal of agent errors from the start. By 2026-10-07 the archive held 235 entries; an evidence review on 2026-10-26 found real value (several concrete procedure changes and regression tests came from entries) and a clear limit (the archive itself records repeated clusters of the same mistake after the rule was written). Conclusion carried into this package: keep reflection, make it short, link each entry to its concrete fix and evidence, search it before a similar task, and never let an entry silently become a new permanent rule. Rules change through a proposals queue the owner decides in batches, because at one point rules were changing every two to three days and nobody could say which version an agent had followed.

## 10. Rituals that did not earn their cost

An audit on 2026-10-07 measured what was ceremony: a `verified` status that was set on 1 of 86 pages; per-entry reflection statuses that nobody maintained (110 of 119 stayed «new»); a «current focus» page that drifted from reality and was removed on 2026-10-26; monthly log rotation that a script now does by size. The template keeps `verified` only as an explicit owner approval mark, drops per-entry statuses, and ships the rotation script. The general rule from the owner's own constitution: fewer mechanisms, but proven ones; before adding one, remove an old one.

## 11. Automation is a separate decision

The source Brain grew a task board, schedulers, watchdogs, a Telegram bridge and nightly retrospectives. Some of it worked; much of it was frozen on 2026-10-26 after measuring that it produced activity rather than accepted results. None of it is needed for the Brain itself, which is why this package stops at «one person, one agent session, files and Git». If you later want automation, the pipelines and cards here are the interface it should respect.

## 12. The same Brain for every agent tool

Claude Code reads `CLAUDE.md`, Codex reads `AGENTS.md`, Gemini reads `GEMINI.md`; skills are discovered from `.claude/skills` or `.agents/skills`. The Brain keeps one real contract and one skill catalog, with pointer files and symlinks for the others, and records the exact model behind every change. Tool-generated memory is treated as a cache of the Brain, never as the Brain. Switching tools then costs nothing, and two tools can work on the same Brain on different days.

## What was deliberately not carried over

Team-specific routes (ticket systems, product repositories, deployment environments), the owner's personal conventions and profile, domain skills tied to one person's hobbies, the automation layer, and machine-specific configuration. Each of these can be added by the owner as domains, skills or conventions once the core works.
