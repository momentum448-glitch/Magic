# Magic — Project Canon

Last updated: 2026-09-30

## Project identity

- Name: Magic
- Repository: https://github.com/momentum448-glitch/Magic
- Drive control folder: https://drive.google.com/drive/folders/11-OPyrRF57g7fJqjGjY3XcMoYVp8FJvF

## Durable continuity architecture

1. GitHub is the canonical execution source.
2. Drive is the human-readable mirror/backup for project-control state.
3. Repository control files live under `project_state/`, except `AGENTS.md` and `README.md` at repository root.
4. A new chat must read `AGENTS.md`, `PROJECT_CANON.md`, `PROJECT_STAGE.md`, and `HANDOFF_CURRENT.md` before taking execution ownership.
5. Actual repository state outranks stale handoff text for execution facts.
6. `HANDOFF_CURRENT.md` is updated last after other affected state documents.
7. Meaningful decisions are preserved in `DECISION_LOG.md`.
8. State documents are updated during the active work session, not promised for later.

## Current product/domain canon

No product/domain canon has been locked yet. The project is entering structured discovery.

## Canon update rule

Only durable cross-session decisions belong here. Temporary tasks, transient blockers, test notes, and immediate next actions belong in `HANDOFF_CURRENT.md` or `PROJECT_STAGE.md`.
