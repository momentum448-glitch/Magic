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


## D-009 — 2026-09-30

**Decision:** Trick 01 uses one stable QR per performer-specific channel.

**Consequence:** The QR can be printed and reused across performances, while shared state remains isolated between performers.

## D-010 — 2026-09-30

**Decision:** Hidden setup mode is activated by a long-press on an invisible hotspot for roughly 2–3 seconds.

**Consequence:** Setup remains absent from ordinary visible navigation and can be entered with one discreet action.

## D-011 — 2026-09-30

**Decision:** The selected card remains active until the performer explicitly changes it.

**Consequence:** There is no automatic reset, expiry, or one-scan consumption in the first design.

## D-012 — 2026-09-30

**Decision:** Spectator reveal uses a natural photographic-looking presentation rather than an app-like control/result screen.

**Consequence:** The QR destination should feel like an ordinary pre-existing image.

## D-013 — 2026-09-30

**Decision:** Setup uses a 52-card grid; performer taps one card and presses Done.

**Consequence:** Setup is optimized for fast mobile operation with minimal interaction steps.


## D-014 — 2026-09-30

**Decision:** Trick 01 v1 will use Firebase Realtime Database for shared cross-device state.

**Reason:** It directly supports small realtime shared state, server-enforced read/write rules, and a web write Promise that resolves when synchronization to the server completes.

## D-015 — 2026-09-30

**Decision:** Firebase Authentication protects performer writes; spectators remain unauthenticated readers.

**Consequence:** Discovering the hidden gesture on an unauthenticated device must not grant setup/write access.

## D-016 — 2026-09-30

**Decision:** Firebase Hosting will host the v1 frontend and card reveal assets.

**Consequence:** v1 uses one integrated Firebase stack for static delivery, auth, and shared state.

## D-017 — 2026-09-30

**Decision:** Initial performer provisioning is manual.

**Consequence:** Self-service registration/admin tooling is deliberately excluded from the first vertical slice.

## D-018 — 2026-09-30

**Decision:** Cloudflare Durable Objects is the fallback backend if two-device Firebase testing shows unacceptable latency, stale reads, authorization friction, or operational constraints.

**Consequence:** Backend choice is locked for implementation but remains evidence-reversible after prototype testing.
