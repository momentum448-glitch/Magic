# Magic — Handoff Current

Handoff ID: **H-0008**  
Last updated: **2026-09-30**  
Current stage: **S2 — GitHub-only vertical slice**  
Status: **PAGES DEPLOYED — WAITING FOR PERFORMER PAT + TWO-DEVICE QC**

## Verified actual state

- `momentum448-glitch/Magic-state`: public and accessible.
- `channels/test01.json`: initialized and readable, currently `AS`, version 1.
- Canonical deployed app source: `Magic/site/`.
- Hidden long-press setup: implemented at 2.2 seconds.
- 52-card setup grid: implemented.
- Performer arm UI: implemented via URL hash `#arm`.
- Performer token storage: `sessionStorage` only for the current browser session.
- Done flow: GET current SHA → PUT updated JSON → success only on successful GitHub response.
- HTTP 409: one re-fetch + retry.
- Spectator read: unauthenticated GitHub Contents API with cache bypass.
- Pages workflow: `.github/workflows/pages.yml`.
- Pages artifact publishes only `site/`; project control docs are not deployed.
- Duplicate root app and obsolete duplicate Pages workflow were removed.

## Deployment verification

Latest verified deployment commit:

`c5809362886f0f89ec50cdb7955ba7be17b63634`

GitHub Actions result: **SUCCESS**

GitHub Pages environment URL:

`https://momentum448-glitch.github.io/Magic/`

QC spectator URL:

`https://momentum448-glitch.github.io/Magic/?c=test01`

Performer one-time arm URL for the current browser session:

`https://momentum448-glitch.github.io/Magic/?c=test01#arm`

## User action required

Create one fine-grained personal access token:

- Resource owner: `momentum448-glitch`
- Repository access: **Only select repositories**
- Repository: **Magic-state**
- Repository permissions → **Contents: Read and write**
- No other write permission needed.
- Prefer a short expiration for prototype testing.
- Do not paste the token into ChatGPT or commit it anywhere.

Then open the performer arm URL on the performer's phone, enter the token, and tap **Arm device**.

## Next QC

1. Performer opens arm URL and arms device.
2. Performer long-presses top-left invisible hotspot for ~2.2s.
3. Select a card, press Done.
4. Confirm “Đã sẵn sàng.”
5. On a second device open the spectator QC URL.
6. Verify the same card appears.
7. Repeat several cards and record latency/failures.
8. Check state repo version increments.

## Remaining acceptance tests

- 50 sequential card changes with zero wrong reveal.
- fresh read from second device after each successful Done.
- rate-limit observation.
- 409 retry behavior.
- token absence from source/build.
- two-channel isolation.

## Sync status

- GitHub: **SYNCED**
- Drive: update follows this checkpoint.
- Pending sync: **NONE**
