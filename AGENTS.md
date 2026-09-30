# AGENTS.md — Magic Execution & Handoff Protocol

## Purpose

This protocol makes project continuity independent of chat length. A fresh chat must be able to read the repository state, verify reality, and continue from the exact next action.

## Mandatory new-chat boot sequence

Before taking execution ownership:

1. Read `AGENTS.md`.
2. Read `project_state/PROJECT_CANON.md`.
3. Read `project_state/PROJECT_STAGE.md`.
4. Read `project_state/HANDOFF_CURRENT.md`.
5. Read `project_state/DECISION_LOG.md` when decision history is relevant.
6. Verify the actual GitHub repository state before implementing work.
7. If the handoff and repository disagree, the actual repository wins for execution facts. Repair the stale state documents before proceeding.

Do not ask the user to repeat information that is already present in these files or verifiable in the repository.

Before claiming GitHub execution/write access is unavailable, verify the actual connected GitHub integration and repository permissions first. For this project, execute GitHub changes directly whenever the connected integration permits them; do not assume manual user action is required without checking.

## Source-of-truth hierarchy

### Execution facts
Actual GitHub repository state > repository state documents > Drive mirror > old chat messages.

### Durable project decisions
`PROJECT_CANON.md` > `DECISION_LOG.md` > `HANDOFF_CURRENT.md`.

## Mandatory state files

### `project_state/PROJECT_CANON.md`
Store only durable, cross-session decisions:
- product/domain canon;
- architecture choices;
- naming conventions;
- scope boundaries;
- long-lived constraints;
- approved operating rules.

Do not put temporary blockers, next actions, or transient test results here.

### `project_state/PROJECT_STAGE.md`
Track:
- current stage;
- stage objective;
- status;
- entry criteria;
- exit criteria;
- milestone progress;
- next stage.

### `project_state/DECISION_LOG.md`
Append meaningful decisions and reversals with:
- decision ID/date;
- decision;
- reason;
- consequence;
- superseded decision when applicable.

### `project_state/HANDOFF_CURRENT.md`
This is the operational cockpit. It must contain:
- current stage and objective;
- work completed;
- actual current state;
- locked decisions;
- files/branches/builds/deploys touched;
- tests/QC completed and results;
- blockers/risks;
- exact next action;
- sync status;
- last-updated date.

## Update triggers

Update `PROJECT_CANON.md` whenever a durable rule, architecture choice, scope boundary, or product decision is locked or changed.

Update `PROJECT_STAGE.md` whenever stage, milestone, stage status, entry criteria, or exit criteria changes.

Append `DECISION_LOG.md` whenever a meaningful decision is locked, changed, or reversed.

Update `HANDOFF_CURRENT.md` after every meaningful:
- implementation;
- repository change;
- test or QC result;
- deploy/build;
- blocker change;
- major decision;
- stage transition.

**HANDOFF_CURRENT must always be updated last.**

## Closing protocol for a substantial work session

Before ending:

1. Verify the actual repository state.
2. Update affected canon/stage/decision documents.
3. Verify tests/QC/build/deploy facts that are claimed.
4. Update `HANDOFF_CURRENT.md` last.
5. Mirror the current state to the Drive control folder when Drive access is available.
6. If Drive sync cannot be completed, write `PENDING_DRIVE_SYNC` in the handoff.

Drive control folder: https://drive.google.com/drive/folders/11-OPyrRF57g7fJqjGjY3XcMoYVp8FJvF

## Structured discovery rule

When the core problem is not yet clear, do not rush into a full solution. Resolve at most the 5–7 highest-impact questions/decisions first.

Separate clearly:
1. items the user must answer;
2. items that can be temporarily assumed, with the assumption stated;
3. items that require research, real data, repository inspection, or testing before conclusion.

For a decision question, give:
- options;
- consequences/trade-offs;
- preliminary recommendation.

After each discovery round summarize:
- confirmed facts;
- locked decisions;
- working assumptions;
- open issues;
- next step.

## Handoff quality rule

A handoff is not a narrative diary. It should let another chat act immediately.

Prefer exact identifiers when available:
- file paths;
- branch names;
- commit/build IDs;
- deployment URLs;
- test names;
- issue/PR numbers;
- asset names.

The next action must be executable, not vague.

## No background-state claims

“Auto-update” means these state files are a mandatory completion step during the active chat/tool session. Never claim a state file was updated unless the write actually happened.
