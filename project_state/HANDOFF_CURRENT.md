# Magic — Handoff Current

Handoff ID: **H-0002**  
Last updated: **2026-09-30**  
Current stage: **S1 — Core Project Discovery**  
Status: **WAITING FOR FOUNDATIONAL DECISIONS**

## Completed in this checkpoint

- Verified repository continuity files before changing project state.
- Locked project domain: digital tools for live magic performance.
- Locked Trick 01: QR Card Reveal.
- Locked audience effect: spectator names any card, scans QR, sees the matching card image.
- Locked performer flow: secretly enter setup mode, select named card, press Done, then spectator scans.
- Locked two-mode model: normal/reveal mode and hidden setup mode in one web product.
- Updated `PROJECT_CANON.md`, `PROJECT_STAGE.md`, and `DECISION_LOG.md`.
- Mirrored canon, stage, decision, and handoff state to Drive.

## Important technical implication

The performer and spectator use different devices. Trick 01 therefore requires shared cross-device state. A purely static/local-only implementation cannot satisfy the effect reliably.

## Open foundational decisions

1. QR/state model: global shared slot vs performer-specific channel vs session-specific QR.
2. Exact hidden gesture for setup entry.
3. Reveal lifecycle/reset/expiry behavior.
4. Spectator-facing reveal presentation.
5. Setup selection UI details.
6. Backend/deployment choice, to be verified for latency and consistency.

## Preliminary recommendation

- performer-specific channel bound to a stable QR;
- one hidden long-press hotspot for setup;
- 52-card grid + Done;
- short server-side armed TTL rather than indefinite stale state;
- spectator page should look like a normal photo/reveal, not an app control panel;
- research a small low-latency shared backend before locking deployment.

## Exact next action

User answers or approves the recommended choices for the 5–6 high-impact decisions above. After that, advance to S2 and design/build the vertical-slice prototype.

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
