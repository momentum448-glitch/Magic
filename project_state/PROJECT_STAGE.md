# Magic — Project Stage

Last updated: 2026-09-30

## S0 — Continuity Infrastructure

Status: **COMPLETE**

## S1 — Core Project Discovery

Status: **COMPLETE**

Locked product outcome:
- Trick 01 is QR Card Reveal.
- Stable QR per performer channel.
- Hidden long-press setup entry.
- 52-card grid + Done.
- Selected card persists until performer changes it.
- Natural photographic spectator reveal.

## S2 — Architecture / Execution Planning

Status: **ACTIVE — GITHUB-ONLY**

Locked v1 stack:
- application repository: `momentum448-glitch/Magic`;
- frontend/static assets: GitHub Pages;
- deploy: GitHub Actions;
- shared state: GitHub REST Contents API;
- performer credential: fine-grained PAT;
- spectator: unauthenticated public read;
- recommended dedicated state repository: `momentum448-glitch/Magic-state`;
- state files: `channels/<channelId>.json`.

### Why a separate state repo is required for the recommended design

A fine-grained PAT with `Contents: write` is scoped to a repository, not a single file path. A separate state repo limits a leaked performer token to mutable trick state instead of giving it write access to the main application source.

### First vertical-slice milestone

1. GitHub Pages serves the app.
2. Performer enters hidden setup.
3. Performer selects one of 52 cards and presses Done.
4. App GETs the current state file to obtain its blob SHA.
5. App PUTs the new JSON through GitHub Contents API using the fine-grained PAT.
6. Done succeeds only after the GitHub API confirms the update.
7. Spectator scans the fixed QR.
8. App fetches the public state JSON from GitHub API with browser cache bypassed.
9. Correct card photo renders.
10. Repeat across two channel files and verify isolation.

### Required validation

- 50 sequential writes with zero wrong reveal after successful Done;
- stale-read testing from a second device;
- handling of HTTP 409 update conflicts by re-fetching SHA and retrying once;
- unauthenticated read rate-limit observation;
- token never present in repository/build/network calls except the authenticated GitHub write request;
- cold-load Pages path works under `/Magic/?c=...`.

### Current dependency

Create the dedicated public state repository `momentum448-glitch/Magic-state`.

The current GitHub connector can edit existing repositories but does not expose repository creation, so this one repository must be created by the user in GitHub UI before the final live write path can be connected.

## S3 — Trick 01 Production Polish

Status: **NOT STARTED**

Entry condition: GitHub-only S2 vertical slice passes correctness, latency, rate-limit, token-safety, and conflict tests.
