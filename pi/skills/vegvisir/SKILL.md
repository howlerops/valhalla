---
name: vegvisir
description: Plan a genuinely multi-session, uncertain effort as a dependency-aware map of decision tickets. Use only when the destination is known but the route cannot fit in one session.
license: MIT
metadata:
  source: https://www.aihero.dev/skills-wayfinder
disable-model-invocation: true
---

# Vegvisir

Vegvisir is planning only. It charts and resolves decisions; it never implements product work. Invoke it explicitly with `/skill:vegvisir <destination>`.

## Start With The Boundary

Use Vegvisir only when the effort needs several sessions and important decisions are still unclear. For work that fits in one session, use the normal planning flow instead.

Before creating any ticket, state the destination for the complete map. It must describe what becomes true when planning is complete, not the next coding task.

Read repository instructions to discover the configured issue tracker and its dependency syntax. Use that tracker when available. If none is configured, keep an uncommitted local Markdown map outside product source files and say that dependency visualization is limited.

## Create The Map

Create one map artifact labelled `wayfinder:map`. It is an index, not a decision log. Keep these sections:

- Destination
- Decisions so far: one linked line for each resolved ticket
- Not yet specified: the fog of war
- Out of scope

Open child tickets only for questions that can be stated precisely now. Record future uncertainty in the fog instead. Add dependency links so the tracker renders the frontier: open, unblocked, unclaimed tickets.

## Ticket Rules

Every ticket must have a question title, one `wayfinder:<type>` label, expected evidence, and its blockers. A ticket is one of:

- `grilling` (HITL): resolve through a live user discussion. Never answer the user's decision for them.
- `prototype` (HITL): resolve with an artifact the user reviews and chooses from.
- `research` (AFK): resolve an external fact, recording sources and the resulting decision.
- `task` (HITL or AFK): a narrowly scoped non-product action that unblocks a decision.

Do not create implementation tickets. A `task` ticket may provision access or expose information, but may not deliver a slice of the destination.

## Work The Frontier

Claim one unblocked ticket before working it. Work one ticket per session by default; parallel research is the only routine exception. For a resolved ticket:

1. Post the resolution and evidence on the ticket.
2. Close the ticket.
3. Add one linked summary line to Decisions so far.
4. Remove any fog that has become a ticket or been ruled out.
5. Re-evaluate the frontier, then stop the session.

When new evidence invalidates a closed decision, create a new decision ticket, link it to the affected decision, and update the map. Do not silently design around the contradiction.

## Finish

When no decision tickets or relevant fog remain, declare the map clear. Hand off to a specification workflow and then implementation planning. Do not begin implementation in this session.

This is an original Pi adaptation of the decision-mapping model described by AI Hero's Wayfinder skill: https://www.aihero.dev/skills-wayfinder
