# Magic — Project Stage

Last updated: 2026-09-30

## S0 — Continuity Infrastructure

Status: **COMPLETE**

## S1 — Core Project Discovery

Status: **COMPLETE**

Locked product outcome:
- Trick 01 is QR Card Reveal.
- Stable QR per performer channel.
- Five-tap setup entry with a visually hidden top-left hotspot.
- 52-card grid + Done.
- Selected card persists until performer changes it.
- Natural photographic spectator reveal.

## S2 — Architecture / Execution Planning

Status: **COMPLETE — GITHUB-ONLY PROTOTYPE ACCEPTED**

Locked v1 stack:
- application repository: `momentum448-glitch/Magic`;
- frontend/static assets: GitHub Pages;
- deploy: GitHub Actions;
- shared state: GitHub REST Contents API;
- performer credential: fine-grained PAT;
- spectator: unauthenticated public read;
- dedicated public state repository: `momentum448-glitch/Magic-state`;
- state files: `channels/<channelId>.json`.

### Completed implementation

- Created and verified public state repo `momentum448-glitch/Magic-state`.
- Initialized:
  - `channels/test01.json`
  - `channels/test02.json`
- Added static app under `site/`:
  - `site/index.html`
  - `site/styles.css`
  - `site/app.js`
  - `site/.nojekyll`
- Implemented:
  - public state read from GitHub Contents API;
  - query-channel routing via `?c=<channelId>`;
  - hidden 5-tap setup gate;
  - 52-card setup grid;
  - performer device arming via `#arm`, plus automatic Arm fallback when the 5-tap trigger is used without a token;
  - session-only PAT storage;
  - GitHub API GET current SHA + PUT updated state;
  - one retry on HTTP 409 conflict;
  - spectator reveal shell;
  - neutral failure states.
- Added GitHub Pages workflow:
  - checkout;
  - JavaScript syntax check;
  - Pages configure;
  - artifact upload;
  - Pages deployment.
- GitHub Actions run `36696469456`: **PASS**.
- Workflow commit: `47fd8543fa665e1a525877c3c690469e289d9bca`.

### Current Pages target

Spectator:
`https://momentum448-glitch.github.io/Magic/?c=test01`

Performer one-time arm page:
`https://momentum448-glitch.github.io/Magic/?c=test01#arm`

### QC checkpoint

- Five-tap setup activation: **PASS on user device**.
- Hidden top-left five-tap hotspot after visual concealment: **PASS on user device**.
- Setup activation blocker from long-press: **RESOLVED**.
- Performer write through GitHub API: **PASS**.
- Second-device reveal correctness after fresh load/manual refresh: **PASS**.
- Already-open spectator page does not auto-update: **ACCEPTED v1 behavior**.
- Automatic polling/realtime refresh: **DEFERRED / NOT NEEDED FOR v1**.

### Final S2 validation

- Sequential card-change correctness on user devices: **PASS**.
- Channel isolation: **PASS**. Actual state checkpoint: `test01` version 6; `test02` version 1.
- Snapshot-on-load latency/behavior: **ACCEPTED for v1**.
- Public REST rate-limit posture: **ACCEPTED for prototype/small-show use**; unauthenticated reads remain an explicit scale constraint.
- PAT source/build exposure check: **PASS**. Pages publishes only `site/`; no performer PAT value is embedded in deployed source.
- HTTP 409 retry path: **IMPLEMENTED**; forced collision remains a non-blocking resilience check.

### Known constraints

- Public unauthenticated GitHub REST requests are rate-limited per originating IP.
- Every card update creates a commit in `Magic-state`.
- Client-side token handling is acceptable only for this prototype and must pass show-use QC.
- Public GitHub-only architecture is not cryptographically secret from a technically inspecting spectator.

## S3 — Trick 01 Production Polish

Status: **ACTIVE**

Objective:
- replace the CSS placeholder card with a natural photographic-looking spectator reveal;
- remove remaining app-like visual cues from spectator mode;
- preserve the hidden five-tap performer flow and the accepted snapshot-on-load backend behavior.

Progress:
- Photographic visual direction selected: casual phone-photo look, warm wooden tabletop, one card slightly rotated, no visible app UI.
- Four representative style-lock samples generated: A♠, 7♥, Q♦, K♣.
- CSS placeholder spectator card has been removed.
- Spectator now renders the exact selected card as an SVG image.
- Current QC build uses the Block52 52-card SVG set from its public GitHub repository under MIT license.
- The card is presented inside a warm wood tabletop scene with perspective, soft shadow, vignette and grain-like texture.
- Performer setup, hidden five-tap trigger and GitHub state flow were left unchanged.

Immediate next work:
1. QC the new spectator photo-scene on mobile.
2. Verify several ranks/suits, especially A♠, 7♥, Q♦, K♣ and a 10-rank card.
3. If visual QC passes, mirror/self-host the 52 SVG files inside `site/assets/cards/` to remove the external asset dependency.
4. Keep performer/backend behavior unchanged.

Residual non-blocking S2 check:
- deliberately force an HTTP 409 update collision when convenient to empirically confirm the existing one-retry recovery path.
