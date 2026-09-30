# Trick 01 — Backend Research

Date: 2026-09-30

## Decision summary

Selected backend for v1: **Firebase Realtime Database + Firebase Authentication**.

Frontend hosting is **GitHub Pages** per the project owner's explicit platform preference.

Fallback if prototype evidence disproves the choice: **Cloudflare Workers + Durable Objects**.

Supabase remains a valid later option if the Magic project grows into a more relational product with richer admin/account/reporting requirements.

## Evaluation criteria

1. Cross-device propagation after performer presses Done.
2. Consistency: spectator must not receive an older card after Done has completed.
3. Per-performer channel isolation.
4. Safe write authorization.
5. Low setup and maintenance complexity.
6. Low prototype cost.
7. Straightforward mobile web deployment.

## Firebase Realtime Database + Authentication

### Strengths

- Purpose-built cross-client synchronized state.
- Browser SDK `set()` / `update()` returns a Promise that resolves when synchronization to the server completes.
- Security Rules can allow public reads while restricting writes by Firebase Auth UID.
- Firebase Auth supports email/password and persistent browser sessions.
- Small v1 data footprint is comfortably within prototype-scale usage.

### Fit for Trick 01

Excellent for backend state/auth. Trick 01 needs only one tiny authoritative state object per performer channel, not a relational data model. Frontend delivery is handled separately by GitHub Pages.

## Cloudflare Durable Objects

### Strengths

- Each Durable Object has private transactional, strongly consistent storage.
- One Durable Object per performer channel maps naturally to the domain model.
- Strong primitive for future live coordination.

### Trade-off

Requires more custom application code for authentication, performer provisioning, API routing, and state access. It is a strong fallback if Firebase propagation tests fail or tighter server-side control becomes necessary.

## Supabase

### Strengths

- PostgreSQL, Row Level Security, Auth-compatible access controls, Realtime.
- Strong fit for richer relational product data and admin/reporting later.

### Trade-off

For Trick 01 v1, Postgres + Realtime is more machinery than required for a single card state per performer channel.

## Current official-source evidence

Firebase:
- https://firebase.google.com/docs/database/security
- https://firebase.google.com/docs/database/web/read-and-write
- https://firebase.google.com/docs/auth/web/start
- https://firebase.google.com/docs/auth/web/auth-state-persistence
- https://firebase.google.com/docs/hosting
- https://firebase.google.com/pricing

Cloudflare:
- https://developers.cloudflare.com/durable-objects/
- https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/
- https://developers.cloudflare.com/workers/platform/pricing/

Supabase:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/realtime

## Prototype evidence still required

The architecture is selected for v1, but production confidence requires a two-device test:
- measure write-commit to fresh-read latency;
- repeat card changes and verify no stale reveal after Done;
- test two performer channels in parallel;
- verify unauthorized write attempts fail;
- verify refresh preserves the currently selected card.


## GitHub Pages hosting decision

GitHub Pages is used for the frontend and static card assets.

Why it fits:
- the app is client-side HTML/CSS/JS;
- Firebase Realtime Database and Auth are callable from the browser;
- the existing public `Magic` repository can host a project Pages site;
- a query-based channel URL avoids server rewrite requirements.

Pages URL for v1:
`https://momentum448-glitch.github.io/Magic/?c=<channelId>`

Firebase Auth configuration must authorize the GitHub Pages origin.
