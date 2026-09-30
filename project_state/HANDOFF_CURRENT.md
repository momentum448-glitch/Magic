# Magic — Handoff Current

Handoff ID: **H-0009**  
Last updated: **2026-09-30**  
Current stage: **S2 — GitHub-only vertical slice**  
Status: **FIVE-TAP SETUP QC PASSED — PERFORMER WRITE + SECOND-DEVICE QC NEXT**

## Latest user-driven UX change

- The previous 2–3 second long-press setup gesture has been removed.
- Setup activation is now **5 taps** on the setup hotspot.
- During prototype/QC the hotspot is intentionally visible.
- Current visible label: `SETUP ×5`.
- Tap progress is shown as `0/5` through `5/5`.
- After the setup flow is proven, the hotspot will be visually hidden while preserving the same 5-tap gesture.
- D-010 is superseded by D-028.

## Five-tap behavior

1. Open the normal channel URL.
2. Tap the visible `SETUP ×5` hotspot 5 times.
3. If a performer token is already armed in the current browser session, the 52-card setup opens.
4. If no token is armed, the 5th tap opens the Arm dialog instead of failing silently.
5. After a successful Arm from this path, the 52-card setup opens automatically.
6. Select a card and press Done.
7. Done GETs the current state SHA and PUTs the new JSON.
8. Success is shown only after GitHub confirms the write.
9. HTTP 409 causes one SHA refresh + retry.

## Verified deployment

Latest deployed app commit:

`bc553ffe46569497092cd1ea9b6ec4e79f5cdff9`

GitHub Actions run:

`36700487226`

Result: **SUCCESS**

Pages URL:

`https://momentum448-glitch.github.io/Magic/?c=test01`

## State backend

- Public state repo: `momentum448-glitch/Magic-state`.
- `channels/test01.json` exists.
- Spectator reads are unauthenticated.
- Performer writes require a fine-grained PAT scoped only to `Magic-state` with `Contents: Read and write`.
- Token is stored only in `sessionStorage` for the current browser session.
- Never paste the PAT into ChatGPT or commit it.

## QC checkpoint

- User confirmed the 5-tap setup activation works correctly on device.
- Visible prototype hotspot behavior: **PASS**.
- Long-press issue: **RESOLVED**.

## Immediate next QC

1. On performer phone, open setup with 5 taps.
2. Choose an obvious card, recommended `7H` (7♥).
3. Press Done.
4. Confirm the performer UI reports `Đã sẵn sàng.`
5. On a second device open `https://momentum448-glitch.github.io/Magic/?c=test01`.
6. Confirm 7♥ appears after a fresh load.
7. Repeat with 2–3 different cards to observe latency and any stale reads.

## Remaining acceptance tests

- performer browser write;
- second-device fresh read;
- 50 sequential card changes;
- rate-limit observation;
- 409 retry;
- token absence from source/build;
- test01/test02 isolation;
- final concealment of the setup hotspot after activation QC passes.

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
