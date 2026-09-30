# Magic — Handoff Current

Handoff ID: **H-0009**  
Last updated: **2026-09-30**  
Current stage: **S2 — GitHub-only vertical slice**  
Status: **FIVE-TAP SETUP DEPLOYED — PERFORMER WRITE QC PENDING**

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

## Immediate QC

1. Open `https://momentum448-glitch.github.io/Magic/?c=test01` on the performer phone.
2. Confirm the visible `SETUP ×5` box appears at top-left.
3. Tap it 5 times.
4. If Arm dialog opens, enter the fine-grained PAT and tap Arm device.
5. Confirm the 52-card grid opens automatically.
6. Select a test card and press Done.
7. Confirm `Đã sẵn sàng.`
8. On another device open the same spectator URL and verify the selected card.

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
