# Magic — Project Stage

Last updated: 2026-09-30

## S0 — Continuity Infrastructure

Status: **COMPLETE**

Objective: establish reliable cross-chat continuity using GitHub + Google Drive.

## S1 — Core Project Discovery

Status: **ACTIVE**

Objective: define the first production-ready magic effect and lock the few architecture decisions that materially affect implementation.

### Confirmed

- Project domain: tools for live magic performance.
- Trick 01: QR-based playing-card reveal.
- Spectator uses the public/reveal flow.
- Performer secretly enters setup mode, selects a card, presses Done, then spectator scanning the QR sees that card.
- A single website product exposes both normal and hidden setup behavior.

### Remaining high-impact decisions

1. shared-state model between performer and spectator devices;
2. performer/channel/session model for the QR;
3. secret setup activation gesture;
4. reveal/reset lifecycle;
5. spectator reveal presentation;
6. first deployment/backend approach.

### Exit criteria

- the six decisions above are locked;
- first implementation milestone is defined;
- architecture is sufficient to build a vertical-slice prototype;
- test plan covers cross-device state, accidental setup discovery, and reset behavior.

## S2 — Architecture / Execution Planning

Status: **NOT STARTED**

Entry condition: S1 exit criteria are satisfied.
