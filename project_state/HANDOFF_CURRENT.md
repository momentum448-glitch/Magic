# Magic — Handoff Current

Handoff ID: **H-0005**  
Last updated: **2026-09-30**  
Current stage: **S2 — Architecture / Execution Planning**  
Status: **READY TO BUILD ON GITHUB PAGES**

## Hosting decision updated

- Use GitHub + GitHub Pages for frontend delivery.
- Use existing repo `momentum448-glitch/Magic`.
- No new repo required for v1.
- Default Pages project URL: `https://momentum448-glitch.github.io/Magic/`.
- Fixed QR channel URL: `https://momentum448-glitch.github.io/Magic/?c=<channelId>`.
- Deploy built static app artifact via GitHub Actions.
- Do not depend on dynamic server routes.

## Backend remains

- Firebase Realtime Database for shared state.
- Firebase Authentication for performer-only write access.
- Spectator remains unauthenticated read-only.
- GitHub Pages origin must be added to Firebase Auth authorized domains.
- Cloudflare Durable Objects remains backend fallback if Firebase fails live tests.

## Superseded decision

Firebase Hosting is no longer used for v1 frontend hosting.

## Why no new repo

The current `Magic` repo can host a GitHub Pages project site. A separate `momentum448-glitch.github.io` repository is only useful if a root account site is specifically desired later.

## Exact next action

1. bootstrap static frontend in `Magic` repo;
2. configure `/Magic/` base path;
3. add GitHub Actions Pages workflow;
4. implement `?c=<channelId>` routing;
5. add Firebase environment/config wiring;
6. implement hidden setup, 52-card selector, Done, reveal shell, and Security Rules;
7. enable/configure a real Firebase project and authorize the GitHub Pages domain;
8. deploy to Pages;
9. run two-device QC.

## Sync status

- GitHub: **SYNCED**
- Drive: **SYNCED**
- Pending sync: **NONE**
