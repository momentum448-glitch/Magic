# Magic — Handoff Current

Handoff ID: **H-0003**  
Last updated: **2026-09-30**  
Current stage: **S1 — Core Project Discovery**  
Status: **BACKEND RESEARCH REMAINS**

## New decisions locked

- QR model: one stable QR per performer-specific channel.
- Hidden setup entry: long-press an invisible hotspot for roughly 2–3 seconds.
- Reveal lifecycle: selected card persists until performer explicitly changes it.
- No automatic reset or expiry in the first design.
- Spectator presentation: natural photographic-looking reveal, not app-like controls.
- Setup UI: 52-card grid + Done.

## Current Trick 01 flow

1. Spectator names any card.
2. Performer secretly long-presses hidden hotspot.
3. Performer taps the card in the 52-card grid and presses Done.
4. Shared performer-channel state changes to that card.
5. Spectator scans the performer’s fixed QR.
6. Spectator sees a natural-looking photo of that exact card.
7. State remains that card until performer changes it.

## Technical implication

A purely static/local-only website is insufficient because performer and spectator use different devices. Shared state must propagate reliably across devices while remaining isolated between performer channels.

## Remaining research

- backend/shared-state service;
- hosting/deployment platform;
- performer-channel provisioning/authentication;
- two-device latency and consistency;
- channel-isolation test.

## Candidate first implementation milestone

Build a two-device vertical slice proving fixed QR → hidden setup → card selection → Done → correct spectator reveal → later performer change updates the next reveal.

## Exact next action

Research current backend/shared-state options and recommend a minimal architecture based on latency, consistency, simplicity, cost, and deployability. Then lock S1 and move to S2.

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
