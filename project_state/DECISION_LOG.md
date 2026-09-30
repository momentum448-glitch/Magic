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
