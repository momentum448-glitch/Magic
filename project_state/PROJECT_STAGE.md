# Magic — Project Stage

Last updated: 2026-09-30

## S0 — Continuity Infrastructure

Status: **COMPLETE**

Objective: establish reliable cross-chat continuity using GitHub + Google Drive.

## S1 — Core Project Discovery

Status: **COMPLETE**

Objective: define Trick 01 sufficiently to choose a vertical-slice architecture.

### Locked outcome

- Product domain: digital tools for live magic performance.
- Trick 01: QR Card Reveal.
- One stable QR per performer-specific channel.
- Hidden long-press setup entry.
- 52-card grid + Done.
- Selected card persists until performer changes it.
- Natural photographic spectator reveal.
- Shared state: Firebase Realtime Database.
- Performer auth: Firebase Authentication.
- Hosting/static assets: Firebase Hosting.
- Spectator remains unauthenticated.
- Cloudflare Durable Objects is the fallback only if prototype evidence disproves Firebase.

### S1 exit status

- effect and performer flow: PASS;
- state/channel model: PASS;
- hidden setup behavior: PASS;
- lifecycle: PASS;
- backend/hosting direction: PASS;
- first milestone: PASS;
- test plan: PASS.

Research notes: `project_state/RESEARCH_BACKEND_TRICK_01.md`  
Architecture: `project_state/ARCHITECTURE_TRICK_01.md`

## S2 — Architecture / Execution Planning

Status: **ACTIVE**

Objective: turn the locked v1 architecture into an executable vertical slice and prove it on two devices.

### First milestone

Build a two-device prototype that proves:

1. performer opens their stable channel;
2. authenticated performer enters setup by hidden long-press;
3. performer selects a card and presses Done;
4. Done waits for server commit;
5. spectator scans fixed QR on another device;
6. spectator receives the correct card image;
7. performer changes the card and the next spectator load follows;
8. unauthorized writes are rejected;
9. two channel IDs do not leak state.

### Current next work

1. bootstrap frontend project in the repository;
2. create Firebase project/configuration or obtain project credentials;
3. implement channel routing, Firebase Auth/RTDB integration, rules, and setup/reveal UI;
4. add placeholder card assets sufficient for functional testing;
5. deploy;
6. run the two-device acceptance suite.

## S3 — Trick 01 Production Polish

Status: **NOT STARTED**

Entry condition: S2 vertical slice passes correctness, isolation, auth, and latency tests.
