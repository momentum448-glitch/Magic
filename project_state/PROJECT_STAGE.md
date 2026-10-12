# Magic — Project Stage

Last updated: 2026-10-12

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

Status: **ACTIVE — PHOTO DECK 52/52 LIVE, V3 15/52; MOBILE LAYOUT QC PENDING**

Objective:
- Show a natural photographic card-reveal with exact rank/suit on all 52 cards and no visible performer controls.
- Upgrade individual photos to user-approved v3 realism; do not replace an unapproved image.
- Preserve the verified five-tap performer setup and GitHub-only snapshot-on-load state.

Production milestones (verified 2026-10-12):
- All **52/52** playing-card codes have active, unique Drive photo URLs in `site/app.js`; no normal card depends on SVG fallback.
- The Drive production image folder has **52** active files, matching **52** mapping IDs with none missing.
- Approved and deployed v3: **AS, 2S–10S, JS, QS, KS, 2H, 3H** = **15/52**.
- Approved 3H photo `Magic_Trick01_3H_v3.png`, Drive file `1iS7eW73GBLu2dtfawf4naM4LPJQ5avk1`; 3H old v2 deleted after successful deploy.
- 3H cache version `20261012-6`, app mapping commit `150c96cfa27aae05bc74570a72c4f0409088db2a`, cache commit `076009c3fb1cc99ed5297fb7dbca5b86975eb399`, GitHub Pages run #109 `38229966329` **SUCCESS**.
- Full-photograph mobile fix is deployed globally with `object-fit: contain` and same-photo letterbox backdrop. **Actual user Android screenshot QC remains PENDING**, not PASS.
- The user requested very short prompts for next-card candidates: `4 of Hearts` only, no extra descriptors.

Immediate next work:
1. Confirm Android user-device QC of the global no-crop mobile layout (6S/KS as convenient).
2. QC 4H candidate. Current minimal-prompt white-card candidate is **NOT approved** and NOT deployed. Generate one new 4H candidate using only the card name if necessary.
3. Only after user approval, upload 4H v3 to the same Drive folder; verify `anyone / reader`, replace only `4H` `PHOTO_ASSETS` mapping, cache-bust and deploy.
4. Verify deploy success and 52/52 mapping coverage; delete obsolete 4H Drive image; then progress to 5H.
5. Continue the one-card-per-approval loop; maintain `project_state/HANDOFF_CURRENT.md` and Drive control mirrors after meaningful checkpoints.

Residual non-blocking check:
- Deliberately force an HTTP 409 update collision when convenient to validate existing one-retry recovery.
