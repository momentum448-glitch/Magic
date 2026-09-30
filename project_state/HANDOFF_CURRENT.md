# Magic — Handoff Current

Handoff ID: **H-0006**  
Last updated: **2026-09-30**  
Current stage: **S2 — Architecture / Execution Planning**  
Status: **GITHUB-ONLY LOCKED — WAITING FOR STATE REPO**

## Architecture now locked

- Main app repo: `momentum448-glitch/Magic`.
- Frontend/static assets: GitHub Pages.
- Deployment: GitHub Actions.
- Mutable shared state: GitHub REST Contents API.
- Performer credential: fine-grained GitHub PAT.
- Spectator: unauthenticated public read.
- Recommended dedicated public state repo: `momentum448-glitch/Magic-state`.
- State files: `channels/<channelId>.json`.
- No Firebase/Supabase/Cloudflare dependency in active v1.

## Why a separate state repo

A fine-grained PAT with `Contents: write` is repository-scoped. Keeping state separate means the performer token cannot alter the `Magic` application code.

## Performer flow

Long press → select card → Done → GET state file SHA → PUT updated JSON with PAT → success only on GitHub 200/201.

On HTTP 409, re-fetch the latest SHA and retry once.

## Spectator flow

Scan fixed QR → GitHub Pages app → parse `?c=<channelId>` → unauthenticated GET state JSON from public state repo with browser cache bypass → render matching local photograph.

## Known GitHub-only constraints

- GitHub unauthenticated REST API primary limit is currently 60 requests/hour per originating IP.
- Every card update creates a repository commit.
- Client-side performer token handling must be tested carefully.
- Fresh-read latency/cache behavior must pass two-device QC.
- A technically inspecting spectator can reverse-engineer public client/state behavior; v1 does not provide cryptographic secrecy.

## Current blocker / dependency

Create public GitHub repository:

`momentum448-glitch/Magic-state`

The current GitHub connector can edit existing repositories but does not expose repository creation. Once the repo exists, the assistant can initialize its state files and continue implementation.

## Exact next action

1. User creates public repo `Magic-state`.
2. Initialize `channels/test01.json`.
3. Bootstrap `Magic` Pages frontend.
4. Implement GitHub API read/write adapter and performer PAT setup.
5. Add hidden setup, 52-card selector, Done, and spectator reveal shell.
6. Deploy GitHub Pages.
7. Run two-device acceptance tests.

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
