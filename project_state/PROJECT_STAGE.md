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


## Trick 02 — ACAAN (parallel proof track, does not change Trick 01 S3)

Status: **QC PROTOTYPE DEPLOYED — REAL-DEVICE QC PENDING** (2026-10-13).

- Locked: 52 cards on wooden table in subtly offset ordered rows; user chooses arbitrary card and position 1–52; hidden setup; GitHub-only sync trial.
- New page: `site/acaan/index.html` under `/Magic/acaan/`.
- Separate state: `Magic-state/channels/acaan_demo01.json`.
- Card-placement algorithm tested exhaustively: 2,704/2,704 correct with 52 unique cards.
- Initial Github Pages workflow `38415254173`: SUCCESS; source commit `ac02f90bc796480e9da542b2032753a6ae9f99bc`.
- Temporary prototype uses existing Block52 SVG faces, NOT approved photographic assets.
- QC polling is limited-duration and is NOT production reliable yet. REST 60 unauthenticated requests/hour/IP, with shared-IP risk.
- Next milestone: two-device latency and on-phone counting QC; compare raw GitHub caching; test phone face down, background, lock, visibility return.
- Existing Trick 01 production stage remains S3, 15/52 approved v3; 4H and mobile no-crop QC still pending.


### 2026-10-14 — Trick 02 deterministic fan v0.2 checkpoint

- GitHub `site/acaan/index.html` replaced the 7×8 mock grid with a fixed curved 52-slot SVG fan on a wooden-looking scene; one vector-size template **190×262 viewBox units**, including K♣.
- Source commit `53a5d6f0c59d2eba1ddaffbc4dc4bd890b7440a7`; GitHub Pages run `38526510021` SUCCESS.
- Local browser screenshot QC: 1448×1086 desktop and 390×844 Android-sized viewport, no JavaScript errors.
- Algorithm: **2,704/2,704 permutations PASS**, zero duplicates. Browser samples `7H/21`, `AS/1`, `KD/52`, `10C/13`, `KC/1`, `KC/52` PASS; 52 equal SVG dimensions and 52 visible indices.
- Browser touch zoom: emulated Android pinch scale 2.5× succeeds. Actual user-device pinch zoom still PENDING.
- Public QC: `https://momentum448-glitch.github.io/Magic/acaan/?c=demo01&qc=1`. Static sample `&sample=7H-21` bypasses GitHub (QC only), enabling visual count inspection without consuming API quota.
- Remaining NOT PASS: photo-level card face/paper/wood realism; real Android / two-device synchronization latency and update while screen face down or locked; 60 unauthenticated GitHub REST requests/hour per IP.
- Do not change Trick 01's S3 4H approval status or its 52-photo mappings.


### 2026-10-14 — Trick 02 fan v0.3 art integration

- Updated `site/acaan/index.html` commit `d877116192ce50e8aafecd2e24df5e3ff300b509` in isolated Trick 02. Pages workflow `38529599372` SUCCESS for that commit.
- Imported all **12 J/Q/K court SVG assets** into `site/acaan/assets/` plus `ASSET_SOURCES.md`; sourced from MIT-licensed Webisso/playing-cards / Byron Knoll public-domain vector material.
- SVG renderer uses local `./assets/{jack|queen|king}_of_{suit}.svg` for whichever court is exposed at slot 52, with the previous deterministic fallback artwork underneath if an image cannot load. All 52 geometry and index labels retain the same fixed card template size 190×262. Number and Ace faces still use deterministic vector pips for exposed final slot.
- Added optional static **real wooden tabletop photograph** (Kevin Shek, Unsplash License) as CSS background, with CSS textured fallback. This background image is currently an external asset request, **not yet self-hosted**; it is not a realtime/state provider. Online image loading/user phone appearance remain to be inspected; do NOT claim photographic visual approval yet.
- Self-QC in local browser using injected DOM (direct browser navigation blocked by execution policy): 6 cases × mobile 390×844 plus desktop 1448×1086 = **12/12 PASS** for 52 slots, 52 unique card identities, selected slot, same card dimensions, no JavaScript exceptions or viewport horizontal overflow. Court image src correctly tracks KD/52, QH/52 and KC/52; KC/1 correctly shows a numeric final card.
- Browser screenshots with local/offline assets display fallback, so **actual remote court artwork/Unsplash photo loaded/rendered PASS is not claimed**. Production visual QC and real Android zoom/no-F5/latency remain PENDING.
- Trick 01 files unaffected, confirmed through compare from fan v0.2 commit; changes limited to Trick 02 and project_state files.


### 2026-10-14 — Trick 02 fan v0.4 horizontal mixed deck / generated wood background

- User-supplied Android screenshot and explicit corrected design requirements applied: almost straight horizontal card ribbon, only slight curvature, separate photorealistic wooden table, no ordered suits/ranks.
- New generated static image `ACAAN_WOOD_BACKGROUND_v04.jpg` from wood-only ImageGen (941×1672 JPEG, 421,784 bytes), uploaded into MAGIC Project Control Drive folder: file ID `1Aa6EBY3Vni1WAWz-9csQfBwwMdB8iDao`. Permissions verified `anyone/reader`. Website uses Drive thumbnail as first static background layer, with Unsplash and CSS fallback. The generated wood is a static resource; GitHub-only **state** architecture stays unchanged.
- Updated isolated `site/acaan/index.html` source commit `c8fe4198a38cf1821779e55decf4456d485b8ca2`: `STEP_X=1140, X0=73, Y0=390, ARC=46`, max ±7.2°; deterministic seeded Fisher-Yates `0xACAA6524` base deck, fixed from load to load; selected (card, number) still applied by pair swap.
- GitHub Pages run `38544956694` **SUCCESS** for exact v0.4 source commit. No Trick 01 files edited.
- Local Chromium screenshot QC with the exact generated wood image embedded offline, SVG geometry and shuffled base: desktop 1448×1086 and mobile 390×844 inspected. 6 card/position cases × 2 screen sizes = **12/12 PASS** (52 distinct, desired index, 52 equal 190×262 SVG templates, no page errors, no horizontal overflow). 2,704/2,704 pairs exhaustive logic test PASS.
- Still **PENDING real-device**: GitHub Pages loading of actual Google Drive thumbnail (vs offline embedded copy), visible rank/suit legibility at different zoom levels, 2-device no-refresh sync rate/latency, background reload/offline behavior and lock/face-down test. Not a fully approved photo-real performance build yet.


### 2026-10-14 — Trick 02 v0.5 vertical ribbon of landscape cards

- User explicit correction adopted: **ribbon runs top-to-bottom, each of the 52 cards lies horizontally**, with slight curve and natural wood-only photographic background. Does not use newly AI-generated deck picture.
- Modified only `site/acaan/index.html`, GitHub commit `54d3b42f8289d46e2fc26bd56bcd745fa3cf9c64`. GitHub Pages workflow `38569596409` **SUCCESS** at exact commit.
- New portrait SVG viewBox `850×1850`; exact **286×198** card template in every slot including K♣; vertical `STEP_Y=29.5`, `X0=270`, `Y0=78`, `ARC_X=45`. 52 slots in a descending near-straight ribbon, maximum tilt ±5.37°. Rank/suit index remains upright on each exposed top strip. The final court illustration is rotated and scaled without aspect distortion to the landscape slot.
- Retained reproducible Fisher-Yates `0xACAA6524` seed, ACAAN single-swap, 52 unique identities, Drive wood photo background `1Aa6EBY3Vni1WAWz-9csQfBwwMdB8iDao`, separate `Magic-state/channels/acaan_demo01.json`, hidden five-tap setup.
- Exhaustive permutation logic QC: **2,704/2,704 PASS**. Deployed JS extracted from exact GitHub file parses successfully. Local Chromium DOM/screenshot tests run with matching SVG geometry and exact same wood JPEG included as data URL: **2/2 Android-sized 390×844 and desktop 1448×1086 PASS** for 52 unique codes, 7H at #21, 52 indices, landscape card geometry 286×198 for all 52, max tilt ≤5.37°, no JS page errors or viewport horizontal overflow.
- Screenshots `/mnt/data/acaan_v05_android_qc.png` and `/mnt/data/acaan_v05_desktop_qc.png` generated in test runtime. Testing via isolated local reconstruction is a **geometry/logic proof**, not a claim that remote network static wood and SVG court assets loaded successfully.
- **Real Android user visual QC and two-device GitHub-only synchronization latency still PENDING**. No realtime guarantee or photo-grade production approval.
