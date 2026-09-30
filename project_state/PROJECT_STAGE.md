# Magic — Project Stage

Last updated: 2026-09-30

## S0 — Continuity Infrastructure

Status: **COMPLETE**

## S1 — Core Project Discovery

Status: **COMPLETE**

Locked product outcome:
- Trick 01 is QR Card Reveal.
- Stable QR per performer channel.
- Five-tap setup entry. Hotspot stays visible during prototype/QC and will be hidden after the flow passes.
- 52-card grid + Done.
- Selected card persists until performer changes it.
- Natural photographic spectator reveal.

## S2 — Architecture / Execution Planning

Status: **ACTIVE — CORE CROSS-DEVICE FLOW PASSED / STABILITY QC PENDING**

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
  - visible 5-tap setup gate for prototype/QC;
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

- Five-tap visible setup hotspot: **PASS on user device**.
- Setup activation blocker from long-press: **RESOLVED**.
- Performer write through GitHub API: **PASS**.
- Second-device reveal correctness after fresh load/manual refresh: **PASS**.
- Already-open spectator page does not auto-update: **ACCEPTED v1 behavior**.
- Automatic polling/realtime refresh: **DEFERRED / NOT NEEDED FOR v1**.

### Remaining S2 validation

1. Run sequential card-change correctness test.
2. Verify `test01` and `test02` isolation.
3. Observe latency and public API rate-limit headers.
4. Confirm PAT never appears in source/build artifact.
5. After activation/QC is complete, visually hide the setup hotspot while keeping the 5-tap gesture.

### Known constraints

- Public unauthenticated GitHub REST requests are rate-limited per originating IP.
- Every card update creates a commit in `Magic-state`.
- Client-side token handling is acceptable only for this prototype and must pass show-use QC.
- Public GitHub-only architecture is not cryptographically secret from a technically inspecting spectator.

## S3 — Trick 01 Production Polish

Status: **NOT STARTED**

Entry condition: GitHub-only S2 vertical slice passes correctness, latency, rate-limit, token-safety, and conflict tests.
