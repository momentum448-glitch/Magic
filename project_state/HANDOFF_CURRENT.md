# Magic — Handoff Current

Handoff ID: H-0007
Last updated: 2026-09-30
Stage: S2 — GitHub-only vertical slice
Status: IMPLEMENTED — WAITING FOR PAGES ENABLE + PAT + LIVE QC

Actual repository state
- Magic-state exists and is public.
- Magic-state/channels/test01.json exists with cardCode AS, version 1.
- Magic/index.html implemented.
- Magic/app.css implemented.
- Magic/app.js implemented.
- Magic/.github/workflows/pages.yml implemented.

Implemented behavior
- fixed QR/query channel model
- public spectator state read through GitHub Contents API
- cache-bypass request
- hidden hotspot long press 2.2 seconds
- 52-card setup grid
- local performer token storage
- Done GETs current SHA then PUTs new state
- HTTP 409 causes one SHA refresh + retry
- Done never reports success on failed write
- spectator never sends performer token

Current verification
- state repo access: PASS
- state file initialization: PASS
- app code committed: PASS
- Pages workflow committed: PASS
- public Pages URL: NOT VERIFIED / currently inaccessible from external check
- live performer write: NOT TESTED
- two-device QC: NOT TESTED

User action required
1. Magic repository → Settings → Pages → Build and deployment → Source = GitHub Actions.
2. Create fine-grained PAT:
   - repository access: only momentum448-glitch/Magic-state
   - repository permission: Contents = Read and write
   - no other write permission
3. Do not paste token into chat. Enter it only into performer setup UI after Pages is live.

Expected QC URL
https://momentum448-glitch.github.io/Magic/?c=test01

Next execution
After Pages is enabled, verify deploy URL, enter PAT on performer device, change card, then scan/reload from second device and measure correctness/latency.

Sync status
Drive: SYNCED
GitHub: handoff update will be final repo write.
