# AI Brain — a personal memory and working system for you and your AI agent

**Give your AI agent a link to this repository and tell it:**

> Install my personal AI Brain from this repository by following its INSTALL.md. Then help me move my existing notes, chats and projects into it.

That is the whole onboarding. The installer is written for the agent, not for you. The agent asks you a handful of questions, creates a private repository, builds the structure, imports what you already have and shows you how to use it. Used daily with Claude Code and Codex; Gemini CLI reads `GEMINI.md`; any agent that can read Markdown, run shell commands and use Git can follow the same contract.

## What you get

A private Git repository where your agent keeps, in files, everything it should remember and continue:

| What | Where | Why it matters |
|---|---|---|
| Your own words, exactly as you said them | `raw/` | Nothing you wrote is rewritten by a model. You can always see the original. |
| Knowledge with sources | `wiki/` | Every claim leads to its source and date. You can tell a fact from a model's guess. |
| Who you are and how you like to work | `wiki/meta/profile.md`, `conventions.md` | Each new session starts informed, without a biography interview. The profile is short, roughly 10–15 lines; details live in domain pages. |
| Current work | `tasks.md`, `design/<task>/STATE.md` | A new session picks the task up where the previous one stopped. |
| What changed | `log.md` | A short dated trail with links to details. |
| Lessons from the agent's own mistakes | `wiki/meta/reflections.md` | Corrections are recorded with evidence and found again when a similar task comes up. |
| Working procedures | `.claude/skills/` | Save, integrate, answer, plan and build, research, audit. The agent loads the one the task needs. |
| Mechanical checks | `tools/` | Link and metadata checks, context budgets, log rotation. No background automation required. |

## What this is based on

This package is the portable essence of one person's AI Brain, used daily since mid-2026 with Claude Code and Codex across work, research, personal projects and life records. The rules here are not a theory; each one came from something that went wrong or worked well. [docs/lessons.md](docs/lessons.md) tells that story so you can decide what to keep.

Deliberately not included: task boards, schedulers, watchdogs, Telegram bots and other automation. A Brain works with one person and one agent session at a time; add automation later if you want it.

## Why the agent installs it, not you

The hard part of a personal knowledge system is not the folder layout. It is deciding where each of your existing things goes, what counts as a decision versus a passing idea, and which parts of old chats are still true. That is reading and judgement work, and an agent with your materials in front of it does it better than a form. [INSTALL.md](INSTALL.md) tells the agent exactly how, including what to ask you and what never to do without asking.

## Private, not a fork

Your Brain contains your private material, so it must live in a **private** repository. A fork of a public repository on GitHub cannot be made private, so do not fork. Use **Use this template → Create a new repository → Private** (the button appears once the repository is marked as a template in its GitHub settings), or let the agent clone this repository and start a fresh Git history in your own private remote. The installer verifies that any configured remote is private before it writes anything personal; without a remote it works locally and records that as an open item.

## Updating later

System files (contract, skills, tools, templates) and your files (sources, wiki pages, tasks, log, profile, conventions) are separate. To pick up a newer version of the system, pull the template into a branch and merge only the system paths listed in [INSTALL.md](INSTALL.md#updating-the-system-files-later). Your content is never touched by an update.

## Requirements

- A local agent environment with file access, a POSIX shell, Git and symlink support (Claude Code, Codex and Gemini CLI were used; the hook configurations are theirs and other tools need their own).
- Node.js 18+ for the mechanical checks; optional at first.
- A private Git remote (GitHub, GitLab, Gitea or any other); optional at first, the Brain works locally.
- Your materials as files the agent can open (exports of chats and notes, documents, repositories). The agent cannot log into your services for you; large imports proceed in batches you review.

## License

MIT for the system files ([LICENSE](LICENSE)). Your content is yours.

---

## Для русскоязычных

Дайте своему агенту ссылку на этот репозиторий и скажите: «Установи мне личный AI Brain по INSTALL.md и помоги перенести в него мои заметки, чаты и проекты». Агент сам задаст несколько вопросов, создаст приватный репозиторий, построит структуру и разложит ваши материалы. Язык личных файлов агент выберет по вашему ответу; системные файлы и инструкции на английском, потому что так их читает любой агент.
