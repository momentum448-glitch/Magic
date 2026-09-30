# Magic — Handoff Current

Handoff ID: **H-0004**  
Last updated: **2026-09-30**  
Current stage: **S2 — Architecture / Execution Planning**  
Status: **READY TO BUILD VERTICAL SLICE**

## Completed in this checkpoint

- Researched Firebase Realtime Database, Firebase Auth/Hosting, Cloudflare Durable Objects, and Supabase.
- Selected Firebase stack for Trick 01 v1.
- Added backend research and architecture files to GitHub.
- Added `MAGIC — TRICK_01_BACKEND_ARCHITECTURE` to Drive.
- Updated `PROJECT_CANON.md`, `PROJECT_STAGE.md`, and `DECISION_LOG.md`.
- S1 Core Project Discovery is **COMPLETE**.
- S2 is **ACTIVE**.

## Locked v1 backend architecture

- Firebase Hosting: frontend and card assets.
- Firebase Realtime Database: shared performer-channel card state.
- Firebase Authentication: performer-only write access.
- Spectator: unauthenticated public read.
- Stable QR per performer-specific channel.
- Performer auth persists on their own browser/device.
- Done only succeeds after server synchronization completes.
- Initial performer/channel provisioning is manual.
- Cloudflare Durable Objects is fallback if Firebase fails two-device testing.

## Suggested channel state

```
channelOwners/<channelId> = <firebaseUid>

channels/<channelId>/
  cardCode
  updatedAt
  version
```

## Vertical-slice acceptance tests

1. 50 card changes, zero wrong reveal after Done resolves.
2. Refresh preserves current selected card.
3. Two channels produce zero cross-channel leakage.
4. Unauthorized writes are rejected.
5. Spectator long-press exposes no setup when unauthenticated.
6. Measure Done-resolved → second-device fresh-read latency; working p95 target under 1 second on normal Wi-Fi/4G.
7. Performer offline/failure must not falsely report success.

## Current blocker/dependency

A real Firebase project/config is required before live backend integration and deployment can be verified.

Repository code can be bootstrapped before credentials are available.

## Exact next action

Bootstrap the web frontend in the Magic repository, implement environment-based Firebase wiring, channel routing, hidden setup UI, 52-card selection, spectator reveal shell, and Firebase Security Rules. Then connect a real Firebase project and deploy for two-device QC.

## Key files

- `project_state/RESEARCH_BACKEND_TRICK_01.md`
- `project_state/ARCHITECTURE_TRICK_01.md`
- `project_state/PROJECT_CANON.md`
- `project_state/PROJECT_STAGE.md`

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
