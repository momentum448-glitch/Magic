# Magic — Decision Log

## D-001 — 2026-09-30

**Decision:** Use both GitHub and Google Drive for project continuity.

**Reason:** GitHub preserves execution truth and versioned state; Drive provides an easy human-readable control surface.

**Consequence:** New chats use the repository to verify real execution state and the Drive folder as a readable mirror/backup.

## D-002 — 2026-09-30

**Decision:** Actual GitHub repository state outranks handoff text for execution facts.

**Consequence:** A new chat must verify the repository before acting.

## D-003 — 2026-09-30

**Decision:** Maintain PROJECT_CANON, PROJECT_STAGE, HANDOFF_CURRENT, and DECISION_LOG as separate responsibilities.

**Consequence:** Durable rules, lifecycle stage, immediate execution context, and decision history do not get mixed together.

## D-004 — 2026-09-30

**Decision:** HANDOFF_CURRENT is updated last after every meaningful checkpoint.

**Consequence:** The handoff points to the latest coherent project state.

## D-005 — 2026-09-30

**Decision:** “Auto-update” is implemented as a mandatory in-session completion protocol.

**Consequence:** No state update is claimed unless the relevant tool actually wrote it during the active session.


## D-006 — 2026-09-30

**Decision:** Magic is a project for digital tools that support live magic performance.

**Consequence:** Product decisions prioritize performer speed, concealment, reliability, and spectator-facing naturalness.

## D-007 — 2026-09-30

**Decision:** Trick 01 is a QR-based playing-card reveal.

**Effect:** The spectator names any playing card, scans a QR code, and sees an image matching the named card.

## D-008 — 2026-09-30

**Decision:** Trick 01 uses one web product with a normal/reveal mode and a hidden performer setup mode.

**Performer flow:** Secretly enter setup mode, select the named card, press Done, then let the spectator scan.

**Consequence:** The implementation must support state transfer across devices without exposing setup controls to the spectator.


## D-009 — 2026-09-30

**Decision:** Trick 01 uses one stable QR per performer-specific channel.

**Consequence:** The QR can be printed and reused across performances, while shared state remains isolated between performers.

## D-010 — 2026-09-30

**Decision:** Hidden setup mode is activated by a long-press on an invisible hotspot for roughly 2–3 seconds.

**Consequence:** Setup remains absent from ordinary visible navigation and can be entered with one discreet action.

## D-011 — 2026-09-30

**Decision:** The selected card remains active until the performer explicitly changes it.

**Consequence:** There is no automatic reset, expiry, or one-scan consumption in the first design.

## D-012 — 2026-09-30

**Decision:** Spectator reveal uses a natural photographic-looking presentation rather than an app-like control/result screen.

**Consequence:** The QR destination should feel like an ordinary pre-existing image.

## D-013 — 2026-09-30

**Decision:** Setup uses a 52-card grid; performer taps one card and presses Done.

**Consequence:** Setup is optimized for fast mobile operation with minimal interaction steps.


## D-014 — 2026-09-30

**Decision:** Trick 01 v1 will use Firebase Realtime Database for shared cross-device state.

**Reason:** It directly supports small realtime shared state, server-enforced read/write rules, and a web write Promise that resolves when synchronization to the server completes.

## D-015 — 2026-09-30

**Decision:** Firebase Authentication protects performer writes; spectators remain unauthenticated readers.

**Consequence:** Discovering the hidden gesture on an unauthenticated device must not grant setup/write access.

## D-016 — 2026-09-30

**Decision:** Firebase Hosting will host the v1 frontend and card reveal assets.

**Consequence:** v1 uses one integrated Firebase stack for static delivery, auth, and shared state.

## D-017 — 2026-09-30

**Decision:** Initial performer provisioning is manual.

**Consequence:** Self-service registration/admin tooling is deliberately excluded from the first vertical slice.

## D-018 — 2026-09-30

**Decision:** Cloudflare Durable Objects is the fallback backend if two-device Firebase testing shows unacceptable latency, stale reads, authorization friction, or operational constraints.

**Consequence:** Backend choice is locked for implementation but remains evidence-reversible after prototype testing.


## D-019 — 2026-09-30

**Decision:** GitHub Pages, not Firebase Hosting, will host the Trick 01 v1 frontend and card assets.

**Reason:** The project owner explicitly wants GitHub + GitHub Pages as the web delivery platform.

**Consequence:** Firebase is retained only for Realtime Database and Authentication. D-016 is superseded for frontend hosting.

## D-020 — 2026-09-30

**Decision:** The existing public repository `momentum448-glitch/Magic` will be used for the first GitHub Pages deployment; no new repository is required for v1.

**Consequence:** The default project site can use `https://momentum448-glitch.github.io/Magic/`. A new `momentum448-glitch.github.io` repository is only useful later if a root account site is specifically desired.

## D-021 — 2026-09-30

**Decision:** v1 uses a static-host-safe query channel URL, e.g. `?c=<channelId>`.

**Reason:** GitHub Pages is static hosting and the project site naturally lives under the `/Magic/` base path.

**Consequence:** The fixed QR does not depend on server-side dynamic routing or SPA rewrite hacks.

## D-022 — 2026-09-30

**Decision:** GitHub Pages deployment should publish a built static artifact through GitHub Actions rather than exposing the repository tree as the site source.

**Consequence:** Application deployment is decoupled from project-control files and future build tooling can handle the `/Magic/` base path cleanly.


## D-023 — 2026-09-30

**Decision:** Trick 01 v1 will be GitHub-only: GitHub Pages + GitHub REST API, with no Firebase/Supabase/Cloudflare dependency in the active architecture.

**Consequence:** D-014, D-015, D-017, and D-018 are superseded for v1. D-019 through D-022 remain applicable for Pages hosting/deployment.

## D-024 — 2026-09-30

**Decision:** Performer writes current card state through GitHub's repository Contents API using a fine-grained personal access token with `Contents: write`.

**Consequence:** Done is successful only when GitHub returns a successful file update response. Every card change creates a repository commit.

## D-025 — 2026-09-30

**Decision:** Use a separate public state repository, recommended name `momentum448-glitch/Magic-state`, rather than storing mutable state in the main `Magic` code repository.

**Reason:** Fine-grained PAT contents permission is repository-scoped, not path-scoped.

**Consequence:** The performer token can be restricted to state only and cannot modify the application source repository.

## D-026 — 2026-09-30

**Decision:** Spectators read the current channel JSON without authentication from the public state repository.

**Consequence:** v1 must account for GitHub's unauthenticated REST API rate limit and verify fresh-read latency/cache behavior under real two-device testing.

## D-027 — 2026-09-30

**Decision:** State file format is one JSON file per performer channel, e.g. `channels/<channelId>.json`.

**Consequence:** Multiple performer channels are isolated by path and can be tested independently.


## D-028 — 2026-09-30

**Decision:** Replace the 2–3 second long-press setup gesture with 5 taps on the setup hotspot.

**Reason:** Long-press was unreliable during device QC.

**Prototype behavior:** The hotspot is intentionally visible and displays tap progress so activation can be verified easily.

**Production intent:** After the setup flow passes QC, visually hide the hotspot while preserving the 5-tap gesture.

**Consequence:** D-010 is superseded. If the device has not been armed with a performer token, the 5th tap opens the Arm dialog instead of failing silently; after successful Arm, setup opens automatically.


## D-029 — 2026-09-30

**Decision:** Accept snapshot-on-load spectator behavior for v1.

**Observed QC:** The second device shows the correct selected card after a fresh page load / manual refresh. An already-open spectator page does not update automatically.

**Reason:** The live trick sequence prepares the card before the spectator scans the QR, so a fresh load naturally retrieves the intended state.

**Consequence:** Do not add polling or realtime refresh in v1. If a spectator page was already open before a performer update, manual refresh is required.


## D-030 — 2026-09-30

**Decision:** Hide the visual treatment of the five-tap setup hotspot while keeping the same five-tap activation area and gesture.

**Reason:** The visible prototype trigger has passed device QC and should no longer be exposed in the spectator-facing experience.

**Consequence:** The active build has no visible `SETUP ×5` label or tap counter. The tappable top-left hotspot remains active for five taps, and all existing Arm/setup behavior is unchanged.
