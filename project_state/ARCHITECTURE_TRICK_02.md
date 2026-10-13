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
