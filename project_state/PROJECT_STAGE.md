# Magic — Project Stage

Last updated: 2026-09-30

## S0 — Continuity Infrastructure

Status: **COMPLETE**

Objective: establish reliable cross-chat continuity using GitHub + Google Drive.

## S1 — Core Project Discovery

Status: **ACTIVE — BACKEND RESEARCH REMAINS**

Objective: define the first production-ready magic effect and lock the few architecture decisions that materially affect implementation.

### Confirmed

- Project domain: tools for live magic performance.
- Trick 01: QR-based playing-card reveal.
- Spectator uses the public/reveal flow.
- Performer secretly enters setup mode, selects a card, presses Done, then spectator scanning the QR sees that card.
- One website product exposes both normal and hidden setup behavior.
- QR model: one stable QR per performer-specific channel.
- Secret setup gesture: long-press an invisible hotspot for roughly 2–3 seconds.
- Setup UI: 52-card grid + Done.
- Reveal lifecycle: selected card persists until performer explicitly changes it; no automatic expiry/reset.
- Spectator presentation: natural photographic-looking reveal, not an app-like result screen.

### Remaining high-impact work

1. Research and select the backend/shared-state approach.
2. Select hosting/deployment based on the backend choice.
3. Verify cross-device propagation latency and consistency.
4. Define performer-channel provisioning/authentication details.

### S1 exit criteria

- backend/shared-state approach is locked from current evidence;
- first implementation milestone is defined;
- architecture is sufficient to build a vertical-slice prototype;
- test plan covers cross-device state, accidental setup discovery, stale-state behavior, and channel isolation.

## Candidate first implementation milestone

A two-device vertical slice where:
- performer opens their stable channel;
- secretly enters setup;
- selects a card and presses Done;
- a second device scans the fixed QR;
- the second device reveals the correct card;
- changing the card on performer device updates the next spectator reveal;
- no cross-channel leakage occurs.

## S2 — Architecture / Execution Planning

Status: **NOT STARTED**

Entry condition: S1 exit criteria are satisfied.
