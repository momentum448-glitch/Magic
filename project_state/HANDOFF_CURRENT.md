# Magic — Handoff Current

Handoff ID: **H-0018**  
Last updated: **2026-10-01**  
Current stage: **S3 — Trick 01 Production Polish**  
Status: **S3 3S COMPLETE — 45 PHOTO ASSETS REMAIN**

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

## Mobile visual QC result

- Current live SVG-on-tabletop build: **REJECTED visually**.
- User's clarified requirement: spectator must see something that reads as a real phone photograph of a physical card.
- The current live build is still technically correct but visually too synthetic.
- A new 7♥ realistic-photo proof was generated after this QC and is the current visual reference only; it has not yet been deployed.

## Immediate next work

1. Build a true photo-real pre-rendered QC set for A♠, 7♥, Q♦, K♣ and 10♠.
2. Ensure exact card identity is preserved while adding real card-stock texture, natural lighting, perspective, contact shadow and phone-photo imperfections.
3. Integrate those pre-rendered reveal images into spectator mode.
4. Deploy for mobile QC.
5. Scale to all 52 only after this visual set passes.
6. Preserve performer/backend behavior unchanged.

## Execution access note

GitHub execution is available through the connected GitHub integration. AGENTS.md requires verifying actual connector permissions before claiming write access is unavailable.

## Sync status

- GitHub: **SYNCED**
- Drive: mirror follows this handoff checkpoint.
- Pending sync: **NONE**


## H-0013 checkpoint — Drive-hosted photo assets

- User selected Google Drive as the image host for S3 photo-real reveal assets.
- Created Drive folder: `Trick01_Reveal_Assets` under `Magic — Project Control`.
- Uploaded first vertical-slice asset: `Magic_Trick01_7H_QC.jpg`.
- Drive file ID: `1ddxzYL7srwp4muqlk3oJ6ETNEe4KoyN-`.
- Folder ID: `1izQtvZxIa4_j0ZAk2X1lUy8jWlJST5g6`.
- Connected Drive API can upload/move the images, but cannot create an Internet-wide `anyone` permission for this consumer Google account. Domain-sharing attempt returned HTTP 400 because no Workspace domain applies.
- Before spectator integration/QC, user must set `Trick01_Reveal_Assets` to **Anyone with the link — Viewer** in Drive UI.
- Do not replace the live SVG renderer until the public Drive URL is verified, so the current spectator build remains functional.

### Next execution step

1. Verify public access to the Drive asset folder/file after the one-time sharing change.
2. Wire 7♥ to the Drive direct-view URL with safe fallback.
3. Deploy Pages and test on an unauthenticated spectator path/device.
4. If PASS, add A♠, Q♦, K♣ and 10♠ to the same Drive folder and repeat QC.
5. Preserve performer/backend behavior unchanged.


## H-0014 checkpoint — AS photo mapping fix

- User mobile screenshot showed A♠ still rendering via legacy SVG fallback.
- Verified actual state: `Magic-state/channels/test01.json` is `AS`, version 8.
- Root cause: previous photo mapping only covered 7♥; A♠ legitimately fell back to Block52 SVG.
- Uploaded public Drive photo assets for A♠ and Q♦ into `Trick01_Reveal_Assets`; inherited permission verified as `anyone / reader`.
- Restored A♠ to the portrait photo asset for mobile presentation.
- Updated spectator photo URLs to Drive `thumbnail?...&sz=w1600` endpoints for more reliable direct image embedding.
- Current mapped photo cards: A♠, 7♥, Q♦.
- Latest app commit: `9be2dbfc60c38f57b16d177cb7a19a70bf9bb1a9`.
- GitHub Pages run `36854345616`: **SUCCESS**.
- QC target remains `https://momentum448-glitch.github.io/Magic/?c=test01` with current state A♠.
- K♣ and 10♠ photo assets remain pending. Image-generation attempts for K♣ drifted back to A♠ and were not accepted or uploaded.

### Next execution step

1. User reloads QC URL and verifies A♠ now appears as a real-photo scene.
2. If PASS, complete deterministic photo assets for K♣ and 10♠ and map all five QC cards.
3. Only then decide whether to scale the approved visual pipeline to all 52 cards.


## H-0015 checkpoint — cache-busted AS photo deploy

- Added cache-busting query versions to `site/index.html` for `styles.css` and `app.js` so mobile browsers do not keep the legacy SVG renderer during QC.
- Commit: `d29dbaef0ef3f855d046cb781119d9d2f9394075`.
- GitHub Pages run `36854476124`: **SUCCESS**.
- Current channel state remains A♠, so the QC URL should now exercise the A♠ Drive photo path directly.
- Immediate next action is user mobile QC of the same stable URL; if A♠ still falls back, inspect the Drive image request on-device rather than changing card generation again.


## H-0016 checkpoint — five-card photo QC set deployed

- User approved the standalone K♣ and 10♠ photo assets.
- Uploaded to Drive folder `Trick01_Reveal_Assets`:
  - `Magic_Trick01_KC_QC.png` — file ID `1-J7WPJ-OoAnhiV8JmuFLh0qthE2w4TEm`
  - `Magic_Trick01_10S_QC.png` — file ID `11Xoi6Z1lPZfzCPCVCzuNeehzqRZ-rgc-`
- Verified both inherit public `anyone / reader` permission.
- `site/app.js` now maps all five S3 QC cards to Drive photo assets: A♠, 7♥, Q♦, K♣, 10♠.
- Added cache bust version `20261001-3` in `site/index.html`.
- App commit: `b7d9690d5c18a30c6b54a2ad43c690e6dfe1e88b`.
- Cache-bust commit: `bf97e7a8e8b39f07a4182e1bf1e457af4b6a875a`.
- GitHub Pages run `36869253731`: **SUCCESS**.
- Current stable QC URL remains `https://momentum448-glitch.github.io/Magic/?c=test01`.

### Next execution step

1. User performs mobile QC across the five mapped cards.
2. If the five-card set passes, scale the same one-card-at-a-time asset pipeline to the remaining 47 cards.
3. Preserve performer/backend behavior unchanged.


## H-0017 checkpoint — 2♠ completed

- Generated and self-QC'd standalone 2♠ photo asset using the one-card-at-a-time pipeline.
- Uploaded Drive asset: `Magic_Trick01_2S.png` — file ID `1nHGhxCHHUTyZ3VhqFKjIH8GnqcMMmEM7`.
- Verified public permission: `anyone / reader`.
- Added `2S` to `PHOTO_ASSETS` in `site/app.js`.
- Cache-bust version advanced to `20261001-4`.
- GitHub app commits: `c48aa8e27b1f2eb6fa825d43eed6440e2c0646a8` and `72c093afe4e1231c446f84e479b01f84e5eb4cd0`.
- GitHub Pages run `36873357019`: **SUCCESS**.
- test01 state advanced to `2S` for live QC, version 10.
- Completed photo mappings now: A♠, 2♠, 7♥, Q♦, K♣, 10♠.
- Next card in sequence: 3♠.


## H-0018 checkpoint — 3♠ completed

- Generated and self-QC'd standalone 3♠ photo asset.
- Uploaded Drive asset: `Magic_Trick01_3S.png` — file ID `1BES-zoasXvuK_BCYst6u1fVyWo--7UeQ`.
- Verified public permission: `anyone / reader`.
- Added `3S` to `PHOTO_ASSETS` in `site/app.js`.
- Cache-bust version advanced to `20261001-5`.
- GitHub app commits: `a91ff62116f24186bb64014701b4e0bee3d64093` and `2974bfcc4b5c1fdd48c3d48b13b3739733acd2eb`.
- GitHub Pages run `36874028211`: **SUCCESS**.
- test01 state advanced to `3S` for live QC, version 11.
- Completed photo mappings now include A♠, 2♠, 3♠, 7♥, Q♦, K♣, 10♠.
- Next card in sequence: 4♠.
