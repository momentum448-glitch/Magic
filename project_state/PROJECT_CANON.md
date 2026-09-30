# Magic — Project Canon

Last updated: 2026-09-30

## Project identity

- Name: Magic
- Domain: digital tools for live magic performance.
- Repository: https://github.com/momentum448-glitch/Magic
- Drive control folder: https://drive.google.com/drive/folders/11-OPyrRF57g7fJqjGjY3XcMoYVp8FJvF

## Product direction

Magic is a collection of practical digital tools/tricks for magicians. The first deliverable is a web-based card-reveal effect operated through a QR code.

## Trick 01 — QR Card Reveal

### Audience-facing effect

1. The magician gives the spectator a QR code.
2. The spectator freely names any playing card.
3. Before the spectator scans, the magician secretly prepares the website.
4. The spectator scans the QR code on their own device.
5. The website shows a photographic-looking image of the exact named card.

### Performer flow

- The same web product has two modes:
  - normal/reveal mode for the spectator;
  - hidden setup mode for the performer.
- Setup mode is not exposed as an ordinary visible navigation option.
- Setup mode is activated by a secret long-press on an invisible hotspot for roughly 2–3 seconds.
- In setup mode, the performer sees a 52-card grid, taps the named card, then presses Done.
- After Done, the spectator-facing reveal resolves to that selected card.
- The selected card remains active until the performer explicitly changes it. There is no automatic reset or expiry.

### QR / channel model

- Each performer has a stable performer-specific channel.
- Each performer can use one fixed QR code bound to that channel repeatedly across performances.
- The QR does not need to be regenerated for every performance.
- State must be isolated between performer channels.

### Spectator reveal presentation

- The spectator should see a natural photographic-looking reveal rather than an app-like control screen.
- Avoid explicit UI such as “Your card is…” unless later testing proves it improves the effect.
- The result should feel like a pre-existing image reached through an ordinary QR scan.

### Durable UX principles

- The QR path should feel ordinary to a spectator.
- The setup interaction should be fast enough for live performance.
- The setup UI should minimize taps and cognitive load.
- The reveal must not visibly expose performer controls.
- The system must prioritize reliability under real show conditions over decorative complexity.
- Mobile-first behavior is assumed for both performer and spectator flows.

## Durable continuity architecture

1. GitHub is the canonical execution source.
2. Drive is the human-readable mirror/backup for project-control state.
3. Repository control files live under `project_state/`, except `AGENTS.md` and `README.md` at repository root.
4. A new chat must read `AGENTS.md`, `PROJECT_CANON.md`, `PROJECT_STAGE.md`, and `HANDOFF_CURRENT.md` before taking execution ownership.
5. Actual repository state outranks stale handoff text for execution facts.
6. `HANDOFF_CURRENT.md` is updated last after other affected state documents.
7. Meaningful decisions are preserved in `DECISION_LOG.md`.
8. State documents are updated during the active work session, not promised for later.

## Open architecture decisions for Trick 01

The following are not yet canon:
- exact backend/shared-state service;
- hosting/deployment platform;
- authentication/provisioning mechanism for performer-specific channels;
- implementation details for cross-device latency and consistency.

These items require research and/or prototype testing before being locked.

## Canon update rule

Only durable cross-session decisions belong here. Temporary tasks, transient blockers, test notes, and immediate next actions belong in `HANDOFF_CURRENT.md` or `PROJECT_STAGE.md`.
