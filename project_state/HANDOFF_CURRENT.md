# Magic — Handoff Current

Handoff ID: **H-0012**  
Last updated: **2026-09-30**  
Current stage: **S3 — Trick 01 Production Polish**  
Status: **S3 PHOTO-SCENE DEPLOYED — MOBILE VISUAL QC PENDING**

## User-device QC passed

- Hidden five-tap setup activation: **PASS**.
- Performer setup opens correctly.
- Card selection + Done: **PASS**.
- GitHub state write: **PASS**.
- Spectator fresh load/manual refresh shows the correct selected card: **PASS**.
- Sequential card-change stability: **PASS** per user.
- Snapshot-on-load behavior remains accepted for v1.

## Technical S2 verification

- Actual state checkpoint:
  - `Magic-state/channels/test01.json`: version 6.
  - `Magic-state/channels/test02.json`: version 1.
- This supports channel isolation during the completed test sequence.
- Pages workflow publishes only `site/`.
- No performer PAT value is embedded in the deployed site source.
- Performer token remains runtime-only in `sessionStorage`.
- Public spectator reads are unauthenticated. GitHub documents a primary limit of 60 requests/hour per originating IP.
- v1 makes one public read per fresh load/manual refresh and does not poll.
- GitHub-only v1 is accepted for prototype/small-show use, not high-volume public traffic.
- HTTP 409 re-fetch + retry is implemented. A deliberately forced collision remains a non-blocking resilience check.

## Current deployed app

Pages:
`https://momentum448-glitch.github.io/Magic/?c=test01`

Hidden-hotspot app commit:
`79562256985a6cb0a5a3986253ae26c18b71e201`

Deploy run:
`36703904941` — SUCCESS

## S3 objective

Turn the spectator page from a CSS card mockup into a natural photographic-looking reveal while preserving the proven performer/backend flow.

## S3 progress

- Working visual direction: casual warm tabletop photo.
- CSS placeholder card: **REMOVED**.
- Spectator card rendering: **exact SVG image by cardCode**.
- Asset source for QC build: Block52 52-card SVG set, MIT.
- Rank mapping handles Magic `10H`/etc. → Block52 `TH`/etc.
- Spectator styling now includes:
  - warm wood tabletop scene;
  - slight card rotation and perspective;
  - soft cast shadow;
  - vignette/light falloff;
  - subtle texture/grain layers;
  - no success-state text or app-like result label.
- Performer 5-tap setup and backend state flow were not changed.

## Verified S3 deployment

App/content commits:
- spectator markup: `771b39c95bcd58ef57f90f69ef3c06a164b45151`
- tabletop styling: `ea8e806974cc490e78a0b5127afcb522acd9fc63`
- cardCode → SVG mapping: `196e8c2886c618fcc1b1afc49057e0de210621e2`
- third-party license notice: `f1369e8b323e8c529c9d6a034c8e2b36754b2863`

GitHub Actions run:
`36807187180` — **SUCCESS**

QC URL:
`https://momentum448-glitch.github.io/Magic/?c=test01`

## Immediate next work

1. User mobile visual QC of the new spectator reveal.
2. Test A♠, 7♥, Q♦, K♣ and at least one 10-rank card.
3. If visual QC passes, mirror the 52 SVGs into `site/assets/cards/` so production no longer depends on the external raw GitHub asset host.
4. Preserve performer/backend behavior.

## Execution access note

GitHub execution is available through the connected GitHub integration. AGENTS.md requires verifying actual connector permissions before claiming write access is unavailable.

## Sync status

- GitHub: **SYNCED**
- Drive: mirror follows this handoff checkpoint.
- Pending sync: **NONE**
