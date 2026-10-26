---
type: operational
updated: "2026-10-26"
last_linted: ""
sources:
  - "docs/lessons.md, sections 4–6 (decisions of 2026-10-07 and 2026-10-13 in the source Brain)"
authorship:
  - {kind: model, model: claude-fable-5-1, provider: Anthropic, program: Claude Code, contribution: "2026-10-26: template text"}
---

# Work pipelines

Every task starts by choosing one pipeline. Name it in the first reply for Plan → build and Find out and report; the owner may switch it.

| Pipeline | Typical work | Owner's gates | Skill |
|---|---|---|---|
| **Do now** | fixes, small edits, Brain maintenance: a change describable in one sentence | none; one-line result | conventions |
| **Plan → build** | implementation, infrastructure, personal projects, anything that needs a plan | 1. start card; 2. result card with something to try | `implement-task` |
| **Find out and report** | a requested research deliverable, comparison, investigation | 1. start card; 2. result card | `deep-research` |

Answering a question from the Brain (`query`) is «Do now» and read-only; it needs no card.

A task that grows past its pipeline (a «do now» fix that needs a design choice) stops and moves to the next pipeline.

## Brief, delivery and acceptance

Scale this to the task. A small fix is a short message; do not create reports or folders to satisfy a template.

**At intake.** Preserve the requested outcome and acceptance criteria. Distinguish the owner's requirements, verified technical limits and your assumptions. Give every restriction a source; never attribute an invented restriction to the owner. When a real missing permission affects the work, ask for that specific permission and continue the independent part.

**For the reader.** One entry point. Explain the problem, what was examined or changed, findings and their practical meaning, recommendation and remaining uncertainty. A reader must not need the chat. Concrete examples of real input and output when they establish what the result means; anonymize private examples; label synthetic ones.

**For completion.** Check each requested outcome against evidence, not effort. A failed method is a result, not proof the task is impossible: try reasonable alternatives. Mark the outcome incomplete or blocked with the specific missing condition rather than handing the owner a follow-up choice in place of requested work.

## Start card (gate 1)

The owner approves the frame and the appetite, not the course of the work. Before a Plan → build or Find out task, send one message:

```
**Start — <date>: <what will be done, one line>**

**Task.** Who asked and why, in their words; what it means for them.
**Expected result.** What they will open at the end and see there. What is out of scope.
**How.** Three lines: data or code source, method, what will be checked.
**Budget.** N hours; executor and skill in one line.
**Assumptions.** What I decided myself and may be wrong about.
```

Answers: «Go» (frame is right), «Adjust» (text follows), «Drop». A «Go» already given in the conversation covers the scope; do not ask again because a skill was loaded. Plans and intermediate steps are never gated.

## Result card (gate 2)

Only the owner accepts a result, from one screen:

```
**Result — <date>: <what was done, one line>**

**Task.** Who asked and why.
**Result.** What works and where to open it: one link. What was not done and why.
**Example.** One real anonymized example of input and output, if it clarifies the result.
**Next.** What the owner decides now and what happens after each answer.
```

Answers: «Accepted», «Unclear» (rewrite the card only; start no new work), «Wrong» (rework within the remaining budget). No model names, commits or commands in the card; evidence goes behind the link. Something to try (a running page, a command, a test input) beats a description.

## Timeout at a gate

When the owner does not answer within the task's timeout (default 2 hours, set at start), continue to the next **reversible** stage and mark the result «not approved». A timeout never counts as approval or publication. Irreversible or external actions wait: publication, messages to people, team repositories, production, deletion, payments.

## Model roles and helpers

- One lead session per task, one writer per repository. Helpers (subagents or another vendor's CLI run as a subprocess) only read: research, tests, a review. The lead integrates and answers for the result.
- A review is the lead's own decision for a concrete uncertainty, usually code going somewhere shared: one pass, a list of defects back to the lead, no fix loop. Model agreement proves nothing; deterministic checks (tests, `check:brain`, reading the result back) stay before every card.
- Prefer a cheaper model for mechanical work and a stronger one for planning and coordination; record the exact model of every contribution. For an ambiguous brief, two independent attempts by different models and the owner's choice beat a review loop.
- Before a bulk model run: record what is missing, input size, model, quota and stopping condition; pilot a small sample first.

## Skill adaptation

When loading any plugin skill, apply these roles and the one-review policy. Prefer implementation in the current session; do not add a review after every subtask because a plugin recommends it. Keep tests, factual verification and browser checks.
