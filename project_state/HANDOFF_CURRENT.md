# Magic — Handoff Current

Handoff ID: **H-0010**  
Last updated: **2026-09-30**  
Current stage: **S2 — GitHub-only vertical slice**  
Status: **CORE CROSS-DEVICE FLOW PASSED — STABILITY QC NEXT**

## Passed on user devices

- Five-tap visible setup hotspot: **PASS**.
- Performer setup opens correctly.
- Performer selects a card and presses Done.
- GitHub state write succeeds.
- Spectator device shows the correct selected card after a fresh page load / manual refresh.
- User explicitly accepted manual refresh for already-open spectator pages.

## Locked v1 spectator behavior

- Spectator state is **snapshot-on-load**.
- No automatic polling or realtime refresh in v1.
- If spectator opens/scans after performer has pressed Done, the page reads the latest state.
- If spectator page was already open before the card changed, manual refresh/F5 is required.
- This is accepted because the intended live sequence is performer prepares first, spectator scans after.
- Do not add polling unless later show evidence requires it.

## Current deployed app

Pages:
`https://momentum448-glitch.github.io/Magic/?c=test01`

Latest five-tap app commit:
`bc553ffe46569497092cd1ea9b6ec4e79f5cdff9`

Five-tap deploy run:
`36700487226` — SUCCESS

## Next S2 work

1. Run several sequential card changes and check for any wrong/stale card after refresh.
2. Verify `test01` and `test02` isolation.
3. Observe practical update latency.
4. Check public API rate-limit behavior.
5. Confirm performer PAT is absent from source/build.
6. Once core QC is complete, visually hide the setup hotspot while keeping the same 5-tap gesture.
7. Only after stability passes, move to spectator visual polish / photographic card presentation.

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
