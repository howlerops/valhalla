---
description: Run a repo goal end-to-end with a baro-style plan, story DAG, critic loop, and final verification
argument-hint: "<goal>"
---
Run this goal end-to-end using a baro-inspired workflow in Pi.

Goal:
$ARGUMENTS

Use this process:

1. Preconditions
- Confirm the current directory is a git repository before making changes.
- Inspect the repo first: read key docs, package/config files, tests, and existing architecture.
- If the goal is ambiguous enough to risk wrong implementation, ask one concise clarifying question; otherwise proceed.

2. Architecture pass
- Produce a short decision document before edits.
- Pin the files, APIs, schemas, commands, migration strategy, and test strategy that downstream work must follow.
- Avoid broad rewrites unless the goal requires them.

3. Story DAG
- Split the goal into small dependent stories.
- Mark independent stories and execute them in the safest available order.
- Pi does not ship built-in sub-agents or plan mode; if parallelism is needed, propose tmux/Pi subprocesses or an extension-backed workflow before attempting it.
- Track progress in a visible repo-local artifact such as `TODO.md` when the task is substantial.

4. Build loop
- Implement each story in isolated, reviewable increments.
- After each story, run the narrowest useful verification.
- If a story gets stuck, replan that story rather than continuing blindly.

5. Critic loop
- Review the changed code for correctness, regressions, security issues, race conditions, edge cases, and missing tests.
- Repair any concrete findings.

6. Pi execution
- Run the work directly in this Pi session.
- If a task needs parallel work, use a Pi-native extension or explicitly managed subprocesses with clear handoffs and isolated artifacts.

7. Finalizer
- Run the broadest feasible verification for this repo.
- Summarize completed stories, files changed, verification commands, remaining risks, and PR-readiness.

The expected result is an architected plan, a dependency-aware story DAG, parallel execution only where safe, critic/self-repair, final verification, and a PR-ready summary.
