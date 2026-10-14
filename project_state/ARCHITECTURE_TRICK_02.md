# Trick 02 — ACAAN GitHub-only QC architecture

Date: 2026-10-13 (Asia/Bangkok)
Status: TECHNICAL PROTOTYPE DEPLOYED; MOBILE TWO-DEVICE QC PENDING

## Performer effect
1. Spectator scans stable QR and opens a full 52-card face-up tabletop composition.
2. Spectator places phone face down before choosing.
3. Spectator freely names one of 52 cards and a number from 1–52.
4. Performer covertly enters the card and number via hidden 5-tap setup, then Done.
5. Spectator turns the phone back over without reloading.
6. Count cards left-to-right, top-to-bottom; at the chosen position is the chosen card.

## Locked decisions
- This is Trick 02, separate from Trick 01.
- Visual: regular rows with subtle natural offsets/rotations, photographic wood tabletop target.
- GitHub-only for feasibility QC, no third-party realtime backend in active scope.
- Never modify Trick 01 channel files or production card/photo mappings during this experiment.

## Implemented QC prototype v0.1
- Frontend: `site/acaan/index.html`.
- Spectator: `https://momentum448-glitch.github.io/Magic/acaan/?c=demo01`.
- Technical debug overlay: append `&qc=1` (never for a spectator).
- Performer arm: append `#arm`.
- State repo/file: `momentum448-glitch/Magic-state/channels/acaan_demo01.json`.
- GitHub REST Contents GET, authenticated PUT with existing fine-grained PAT from performer session.
- Short QC polling only: 2 seconds during first 75s, then 8s until 180s; stop continuous polling after that. Resume/focus triggers extra read. No 1–2s guarantee for all show durations.
- Deck renderer uses temporary Block52 SVG card faces to check 52 exact identities and zoom/count layout. This is not a user-approved photo-real visual.
- A fixed baseline shuffle is deterministic. For selection (cardCode, position), swap the target card with the card at the desired index. Other positions remain unchanged, and all 52 card codes remain unique.
- Algorithm programmatically tested for all 52×52 = 2704 pairs, 0 invalid results.
- Separate state channel initialized; Trick 01 remains unchanged.

## GitHub-only architectural tradeoffs
1. GitHub REST API is most consistent with the existing accepted Trick 01, but spectator unauthenticated reads are limited to 60/hour **per IP address** (multiple spectators on venue Wi-Fi may share an IP).
2. 2s polling costs roughly 30 requests per minute; it is an intentionally short one-spectator QC window, NOT suitable for unattended production.
3. Raw GitHub URLs with cache-busting merit a separate latency experiment; raw CDN propagation is not guaranteed to be realtime.
4. Pages redeploy is not used to transmit state. App static assets deploy once; mutable data is committed to Magic-state.
5. A phone placed face down does not necessarily background the web page. Visibility/focus refresh cannot replace polling without real device testing.
6. Authenticated conditional GET (ETag/304) may preserve primary quotas but requires credentials; NEVER embed performer/PAT/app secret on spectator phones.
7. Production secrecy limitation: state is publicly readable; magician methods may be discovered via inspection. No user personal data or secrets in public state files.

## Visual system after technical QC
- QC initial renderer: one source card face per code, 7 columns by 8 rows (last row partial).
- Fixed positions and slight per-slot rotation make card changes a visual card swap, not an animation.
- Later move toward a true photo-grade composite scene with authentic paper, controlled shadows, natural offsets, high-resolution zoom and physically coherent perspective.
- The current standalone single-card Drive photos are full scenes, not transparent isolated card-face assets. Do not simply tile them as 52 cards.
- Need verify all corner indices / pip identities, complete deck, and readable count on tall Android devices before approving final visual.

## Acceptance / QC protocol
- Device A (magician) + Device B (spectator), ideally 4G and same-Wi-Fi sub-tests.
- Test: 7H/21; AS/1; KD/52; 10C/13; repeated same card with a different position; 20 randomized pairs.
- Success: every rendered deck has 52 distinct valid cards, the selected one exactly at selected number, zero refreshes or visible transition at reveal.
- Latency: record Done-confirmed time and spectator draw time; working target median ≤2s, p95 ≤4s; not currently claimed.
- Phone tests: screen physically down with display on, screen locked, Chrome/Android background then foreground, browser tab switching, network intermittent.
- Verify GH remaining quota / 403 or 429 behavior and two spectators sharing one IP.
- Security: PAT scoped only to Magic-state; no PAT in public client, code, URLs, debug overlay, or repo; no state writes by spectators.
- Prototype acceptance requires user QC; successful deployment != accepted live-show workflow.

## Evidence
- Initial state commit: `6b3dd92227fb5a9a7480c7f418417d7b95d3c4c1`.
- Frontend commit: `ac02f90bc796480e9da542b2032753a6ae9f99bc`.
- GitHub Pages workflow: `38415254173` — SUCCESS.
- Browser/device QC: PENDING.

## Next technical experiments (in order)
1. User-device visual/count pilot on spectator phone.
2. Two-device stopwatch/recorded latency for REST polling; note time-to-commit vs time-to-render and measured API request remaining.
3. Raw GitHub cache-busted reader comparison without deploying between state changes.
4. Screen-up/down and visibility/resume reliability tests, including long delay.
5. Choose final sync strategy based on real p50/p95 + rate-limit budget, not unverified 1–2s claims.
6. Only then build the photographed deck composition and polish operator mode.


## Visual architecture supersession — v0.2 (2026-10-14)

User confirmed option 2: **deterministic geometry and card identities**, not further AI-generated 52-card photos. This supersedes the older v0.1 '7 columns × 8 rows' and 'ordered rows' visual descriptions above.

- Active source: `site/acaan/index.html`. 52 fixed SVG <g> card slots, all with CARD_W=190 and CARD_H=262 viewBox units, placed along a smooth single-arc fan via `coords(i)`. Every card uses the same width/height and matched rotation formula. No special K♣ scale.
- Base deck: exactly once A–K Hearts, Spades, Diamonds, Clubs. Upon (cardCode, position), a single pair-swap of card codes guarantees the selected card at the chosen count slot and preserves all 52 unique cards. This is independent of card visual assets.
- The corner rank/suit indices are rendered vector-sharp on a separate layer after card bodies to avoid occlusion. The final exposed card uses a temporary deterministic pip/court motif; it is *not* user-approved traditional court artwork.
- Fixed 1440×1000 coordinate canvas fit into phone display; native browser pinch-to-zoom remains enabled by viewport meta, and browser-emulated 2.5× pinch was observed. User-device gesture QC still pending.
- Tech debug mode `?c=demo01&qc=1`; add `&numbers=1` for per-card ordinal marks. Offline deterministic sample: `?c=demo01&qc=1&sample=7H-21` skips API polling/writes for visual inspection.
- Tests: exhaustive 52×52 = 2,704 permutations PASS; six representative browser-render tests PASS, including K♣ first and last; no JS console errors; local desktop & tall mobile screenshots inspected; Github Pages run 38526510021 SUCCESS on source commit 53a5d6f.
- Temporary scene uses CSS wooden-table approximation and vector pip/court placeholders. True photorealism (physical card faces, consistent cast shadows, paper/wood photo assets) remains an independent visual-production step and must be user-approved before production.
- Backend remains existing isolated GitHub-only REST state + bounded prototype polling, not an accepted production realtime guarantee.


## Art layer v0.3 (2026-10-14)

- `site/acaan/assets/` contains 12 verified present J/Q/K court SVG files from Webisso/playing-cards, MIT-licensed, with `ASSET_SOURCES.md`. Render the exposed final card from the appropriate local SVG, keeping the equal-size 190×262 card geometry and stable index overlay. If the SVG fails, fallback court motif remains rendered.
- Card art coverage: courts (J/Q/K all suits) use standard English face art; exposed number/ace cards continue to use deterministic pip patterns, so **true complete photo-looking deck is not yet approved**.
- Static wood backdrop: free photographic background by Kevin Shek (Unsplash License; URL images.unsplash.com/photo-1684846100473-f08fc22f5286), CSS textured fallback. External image is **static decoration only**, NOT a new database/state sync service. Remote image/real-phone loading has not been verified; self-hosting the photo in Magic is advisable after visual approval, to remove runtime dependency. A locally synthesized repeated-photo wood texture failed aesthetic QC and was deliberately NOT uploaded or used.
- GitHub Pages run 38529599372 for visual commit d877116192ce50e8aafecd2e24df5e3ff300b509: SUCCESS.
- QC scope: local DOM-based Chromium injection (direct local URLs blocked in environment), 12/12 samples pass across mobile/desktop for 52 unique cards, exact choice/position, identical dimensions, JS errors 0, horizontal overflow 0; source asset paths present 12/12. These verify markup/logic only, not real-network image loading or visual photorealism.
- Primary remaining gates: on-device appearance and gesture zoom, image-load diagnostics, full photographic feel, operator/spectator two-device actual GitHub-only delay, rate-budget under multiple public spectators and phone locking.


## User correction and v0.4 implementation — 2026-10-14

### Visual design
- Separate wood-only ImageGen asset stored in Google Drive: `ACAAN_WOOD_BACKGROUND_v04.jpg`, ID `1Aa6EBY3Vni1WAWz-9csQfBwwMdB8iDao`, public permission `anyone / reader` confirmed via metadata. URL is a static GitHub Pages CSS background `https://drive.google.com/thumbnail?id=1Aa6EBY3Vni1WAWz-9csQfBwwMdB8iDao&sz=w2200`, with previous Unsplash background and CSS fallback underneath. The Drive asset serves NO realtime/state function. The runtime image URL is not guaranteed until real mobile QC.
- Cards are NOT rendered in ImageGen picture; they remain exactly 52 separate SVG card slots drawn programmatically, with their identities and faces changed via code. All card geometry remains 190×262 viewBox units, including last slot and K♣.
- Coordinates changed from steep ARC=285 to mild ARC=46 in the same 1440×1000 viewBox; `CARD_W=190, CARD_H=262, STEP_X=1140, X0=73, Y0=390, ARC=46`; max |angle| ~7.2° and near-horizontal left-to-right reading order.
- Base card sequence is no longer A–K sorted per suit. Instead a stable Fisher-Yates shuffle seeded with `0xACAA6524` runs identically on spectator/performer devices, so it looks random yet needs no additional state. The selected card's base index is pair-swapped with desired 1–52 slot; all 2,704 possible requests preserve 52 unique card identities, no layout change.

### Validation
- Source commit `c8fe4198a38cf1821779e55decf4456d485b8ca2`; GitHub Pages workflow `38544956694` success.
- Locally inspected desktop and mobile screenshots with the SAME newly generated wood image embedded as a test data URL (due external browser restriction): near-straight horizontal spread and photo texture visually confirmed.
- Chromium DOM test 6 card-number samples × 2 viewports = 12/12 pass on uniqueness, chosen position, equal 190×262 card geometry, no JS page errors/overflow. Exhaustive standalone 2,704 pairs pass with same numeric PRNG algorithm.
- Pending: actual Drive thumbnail loading across Android browsers, pinch-zoom legibility, live spectator GitHub read, screen-lock and 2-device transport latency/rate.
- Trick 01 remains isolated and unchanged.


## V0.5 display-direction supersession (2026-10-14)

- Canon reading: **52-card ribbon is VERTICAL down a portrait viewport, but EACH CARD IS PHYSICALLY HORIZONTAL/LANDSCAPE**. This supersedes the horizontal ribbon/left-to-right counting direction in earlier prototype descriptions. Do not render a fixed AI-generated full-deck image.
- Portrait SVG viewBox **850x1850**, paper rectangle **286x198** per slot (same for card 1..52 including King of Clubs). Geometry: `STEP_Y=29.5, X0=270, Y0=78, ARC_X=45` with `x=X0+ARC_X*sin(π*i/51)`, `y=Y0+STEP_Y*i`, card angle from tangent, approximately ±5.37°. Every card is a different SVG `g[data-slot]` and every card has its own `g[data-index-slot]`. Count **top to bottom**.
- Upright index label and suit share the exposed horizontal top strip (rank at x10 and suit x35/48, both baseline y24) before the next overlapping card begins after 29.5 units. Optional ordinal debug number at x96, y24. The last exposed card shows a court asset rotated 90° through affine translation + scale + rotate inside the shared landscape box, or a deterministic number/ace pip pattern; no special K♣ scale.
- Seeded shuffle and chosen card to numbered position single-swap are unchanged. Wood-only Google Drive photo remains a separate background; state repo and bounded prototype polling unchanged.
- Build source commit `54d3b42f8289d46e2fc26bd56bcd745fa3cf9c64`, Pages workflow `38569596409` SUCCESS.
- QC: exact deployed JS syntax parse PASS, local 2/2 desktop/Android-sized SVG + generated JPG mock browser DOM tests PASS 52 identities / #21 7H / shared landscape proportions / 52 labels / ±5.37° / zero JS errors / no horizontal overflow; all 2704 permutations mathematically PASS. Actual Android photo loading, portrait pinch zoom, and two-device realtime behavior PENDING.
