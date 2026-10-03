# Magic — Handoff Current

Handoff ID: **H-0024**  
Last updated: **2026-10-01**  
Current stage: **S3 — Trick 01 Production Polish**  
Status: **S3 BICYCLE-STYLE DECK CLEANED — 52/52 PRODUCTION ASSETS ONLY**

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


## H-0019 checkpoint — 5♠ deployed, 6♠ generation blocker

- User approved the standalone 5♠ photo asset.
- Uploaded Drive asset: `Magic_Trick01_5S.png` — file ID `14XixqbS55JijLi4UtSRYuCUgoZlQiS-g`.
- Verified public permission: `anyone / reader`.
- Added `5S` to `PHOTO_ASSETS` in `site/app.js`.
- Cache-bust version advanced to `20261001-7`.
- GitHub app commits: `d72d56e017f089d50a928d1ea656cb4422139d2b` and `2f2297fc625bed5fb65ecaf0861d9cab6750d4cd`.
- GitHub Pages run `36882117683`: **SUCCESS**.
- test01 state advanced to `5S`.
- Multiple image-generation attempts for 6♠ incorrectly repeated 5♠, including an attempted edit path. Those outputs were rejected and were not uploaded or mapped.
- Next action: switch 6♠ generation to a fresh-context/deterministic identity-preserving method before continuing 7♠ onward.


## H-0020 checkpoint — deterministic scale-up through 8♥

- Actual GitHub state verified on 2026-10-01.
- Photo mappings currently deployed: A♠, 2♠, 3♠, 4♠, 5♠, 6♠, 7♠, 8♠, 9♠, 10♠, A♥, 2♥, 3♥, 4♥, 5♥, 6♥, 7♥, 8♥, Q♦, K♣.
- Total deployed photo mappings: **20 cards**.
- Latest successful Pages run: `36887645912` — **SUCCESS** for 8♥.
- Current test channel state: `8H`, version 27.
- 9♥ render asset has already been generated locally but has **not yet** been uploaded to Drive, mapped in `site/app.js`, or deployed.
- Performer/backend behavior remains unchanged.
- Next execution step: upload/map/deploy 9♥, then continue 10♥ and onward one card at a time using the deterministic identity-preserving render pipeline.


## H-0021 checkpoint — full 52-card photo deck deployed

- Completed independent reveal assets for all 52 standard playing cards.
- `site/app.js` `PHOTO_ASSETS` contains **52 unique card codes** covering every valid card; no standard card now needs the Block52 SVG fallback.
- Remaining assets were rendered with the deterministic identity-preserving pipeline after image-generation rank/pip drift was observed.
- All generated files are stored under Drive folder `Trick01_Reveal_Assets` (folder ID `1izQtvZxIa4_j0ZAk2X1lUy8jWlJST5g6`). Spot checks on newly uploaded files confirmed inherited `anyone / reader` permission.
- Full-map app commit: `f74d7124434a6bb61e59d1d2ed3e098a6f3d2f06`.
- Final cache-bust commit: `5e6af967f9f5787a03b501727320227f807394f3` using version `20261001-24`.
- GitHub Pages run `36894000832`: **SUCCESS**.
- Current test channel state: `KS`, version 36, so the stable QC URL currently exercises the new K♠ court asset.
- Stable QC URL: `https://momentum448-glitch.github.io/Magic/?c=test01`.
- Performer/backend behavior remains unchanged.

### Next execution step

1. Mobile-QC a representative sweep across suits and card types, especially newly deterministic court cards and high-pip cards.
2. If visual QC passes, mark S3 photo-reveal asset work complete and move to the next Trick 01 production-polish item.
3. If any individual card fails visual QC, replace only that card asset while preserving its card code and Drive-backed mapping.


## H-0022 checkpoint — Bicycle-style rollout at 44/52

- Actual GitHub state verified on 2026-10-02.
- All **40 Ace/number cards (A–10)** are now mapped to Bicycle-style v2 photo assets with deterministic safe margins and conventional pip layouts.
- Updated court cards currently deployed: `JS`, `JH`, `QD`, `KC`.
- Total Bicycle-style v2 mappings deployed: **44 / 52**.
- Remaining old court assets to replace: `QS`, `KS`, `QH`, `KH`, `JD`, `KD`, `JC`, `QC`.
- Latest successful GitHub Pages run: `36962713281` — **SUCCESS** for `JS` Bicycle-style court.
- Current cache version: `20261002-3`.
- Current test channel state: `JS`, version 44.
- JS Drive asset: `Magic_Trick01_JS_Bicycle_v2.png`, file ID `1k8iCsU4bGctw3tw0dpLi4sDrHdslN18z`, verified `anyone / reader`.
- Stable QC URL remains `https://momentum448-glitch.github.io/Magic/?c=test01`.

### Next execution step

1. Replace the 8 remaining court cards one by one with Bicycle-standard-like full two-headed court artwork.
2. Preserve the approved wood-table photo scene, light wear, safe margins, and exact rank/suit identity.
3. After all 52 are Bicycle-style v2, run a final mobile QC sweep for edge overflow, pip count, corner index, and court-card resemblance.


## H-0023 checkpoint — full 52-card Bicycle-style deck deployed

- User feedback identified two production defects in the previous deck: some number-card indices/pips crossed the safe margin, and J/Q/K did not resemble Bicycle Standard closely enough.
- Locked visual target: Bicycle Standard visual language, light wear, photorealistic dark-wood tabletop, conventional pip layouts, safe margins, and full classic two-headed court artwork.
- Rebuilt all **40 Ace/number cards (A–10)** using a deterministic safe-zone template system.
- Replaced all **12 court cards (J/Q/K)** with Bicycle-standard-like classic court assets.
- Rejected intermediate court composites that showed rectangular patch seams; those files were not mapped to production.
- Final `PHOTO_ASSETS` verification: **52 mappings / 52 unique card codes**.
- Final court mappings:
  - JS `1k8iCsU4bGctw3tw0dpLi4sDrHdslN18z`
  - QS `16WQeAdEGqb-mrGZ3HNPnt11kVckK47qt`
  - KS `1XkSfjFD5XIUzQLBN7uipVOG02ZVdUz9l`
  - JH `1Mh3FmbAIjnFO_Ig7CdlfXyvJpE1O4GeF`
  - QH `1CWsuoyHz-s3PKQRluGoluDVE2Zhm9p95`
  - KH `1tKNQSktIZ9YDXS3oitJ39JUP88sRXbY1`
  - JD `1l3tHHmIzeqbR4iF-ewl3KAXyC6EsOeo1`
  - QD `1vEXUBmTQdLYzH2zC1faSqOd2D0LNQsFd`
  - KD `1B_GEoGdXBd4pAd_VawVtSP82wrQl6qPr`
  - JC `1X8vhjEqlnip0Asr3vjjM1s7Rd50AE385`
  - QC `1zdICR-FA1oOvcOslB8TRwurEkyCayEUL`
  - KC `1rhUKiJ9GCHfSordFQ9E0jpqKBqGyAjU1`
- All newly uploaded remaining court files verified with inherited `anyone / reader` permission.
- Full court rollout app commit: `2a69b9802fce3a3e1e57c992358fa57988ad4586`.
- Final cache-bust commit: `91155623ba30d2bb240bbd2f4441efd38b1f66d3`, cache version `20261002-4`.
- GitHub Pages run `36967691609`: **SUCCESS**.
- Current test channel state: `QS`, version 45.
- Stable QC URL: `https://momentum448-glitch.github.io/Magic/?c=test01`.
- Performer/backend behavior remains unchanged.

### Next execution step

1. User performs final mobile QC, starting with QS and checking representative A/number/high-pip/court cards across all four suits.
2. If any individual asset still fails, replace only that asset while preserving its card code and backend behavior.
3. If the sweep passes, mark S3 spectator reveal visual polish complete and move to the next Trick 01 production-polish item.


## H-0024 checkpoint — Drive asset cleanup complete

- User requested removal of duplicate/obsolete reveal assets from Drive.
- Source of truth used for cleanup: the 52 Drive file IDs currently referenced by `site/app.js` `PHOTO_ASSETS`.
- Drive folder `Trick01_Reveal_Assets` contained **104 PNG files** before cleanup: 52 production assets + 52 obsolete/duplicate assets.
- Permanently deleted all 52 obsolete/duplicate `Magic_Trick01_*.png` files that were not referenced by the live app.
- Post-cleanup verification:
  - Drive folder file count: **52**
  - Active app mappings: **52**
  - Active unique Drive IDs: **52**
  - Missing active assets: **0**
  - Extra/unreferenced assets in folder: **0**
- No application code or backend behavior changed during cleanup.
- Stable asset folder: `https://drive.google.com/drive/folders/1izQtvZxIa4_j0ZAk2X1lUy8jWlJST5g6`.
