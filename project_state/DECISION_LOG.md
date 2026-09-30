# Magic — Decision Log

## D-001 — 2026-09-30

**Decision:** Use both GitHub and Google Drive for project continuity.

**Reason:** GitHub preserves execution truth and versioned state; Drive provides an easy human-readable control surface.

**Consequence:** New chats use the repository to verify real execution state and the Drive folder as a readable mirror/backup.

## D-002 — 2026-09-30

**Decision:** Actual GitHub repository state outranks handoff text for execution facts.

**Consequence:** A new chat must verify the repository before acting.

## D-003 — 2026-09-30

**Decision:** Maintain PROJECT_CANON, PROJECT_STAGE, HANDOFF_CURRENT, and DECISION_LOG as separate responsibilities.

**Consequence:** Durable rules, lifecycle stage, immediate execution context, and decision history do not get mixed together.

## D-004 — 2026-09-30

**Decision:** HANDOFF_CURRENT is updated last after every meaningful checkpoint.

**Consequence:** The handoff points to the latest coherent project state.

## D-005 — 2026-09-30

**Decision:** “Auto-update” is implemented as a mandatory in-session completion protocol.

**Consequence:** No state update is claimed unless the relevant tool actually wrote it during the active session.


## D-006 — 2026-09-30

**Decision:** Magic is a project for digital tools that support live magic performance.

**Consequence:** Product decisions prioritize performer speed, concealment, reliability, and spectator-facing naturalness.

## D-007 — 2026-09-30

**Decision:** Trick 01 is a QR-based playing-card reveal.

**Effect:** The spectator names any playing card, scans a QR code, and sees an image matching the named card.

## D-008 — 2026-09-30

**Decision:** Trick 01 uses one web product with a normal/reveal mode and a hidden performer setup mode.

**Performer flow:** Secretly enter setup mode, select the named card, press Done, then let the spectator scan.

**Consequence:** The implementation must support state transfer across devices without exposing setup controls to the spectator.
