# Trick 01 — Architecture v1

Date: 2026-09-30
Status: **LOCKED FOR VERTICAL-SLICE IMPLEMENTATION**

## Stack

- Source repository: GitHub, `momentum448-glitch/Magic`.
- Frontend/static hosting: GitHub Pages.
- Deployment: GitHub Actions builds and publishes only the static app artifact.
- Shared state: Firebase Realtime Database.
- Performer authentication: Firebase Authentication.
- Spectator authentication: none.
- Card images: static assets bundled with the Pages deployment.

## Repository decision

No new repository is required for v1.

Use the existing `Magic` repository. The default project Pages URL is expected to be:

`https://momentum448-glitch.github.io/Magic/`

A separate repository named `momentum448-glitch.github.io` is only needed later if the product specifically needs the GitHub account root site rather than a project site.

## URL/channel model

Each performer owns one stable public channel ID.

Pages-safe v1 URL:

`https://momentum448-glitch.github.io/Magic/?c=<channelId>`

The QR encodes that stable URL and can be printed/reused.

Why query-based routing:
- GitHub Pages is static hosting;
- the current repository is a project site under `/Magic/`;
- query parameters do not require server-side rewrites;
- avoids relying on SPA 404 fallback tricks for a live-show tool.

A future custom domain can preserve the same query model without changing backend state.

## State model

Suggested logical structure:

```
channelOwners/
  <channelId>: <firebaseUid>

channels/
  <channelId>/
    cardCode: "7D"
    updatedAt: <server timestamp>
    version: <integer>
```

## Access model

### Spectator

- Opens the GitHub Pages URL.
- Channel ID comes from `?c=<channelId>`.
- Can read current public state for that channel.
- Does not authenticate.
- Cannot write.

### Performer

- Uses the same GitHub Pages app on their own device.
- Firebase Auth session persists locally unless explicitly signed out.
- Can write only the channel they own.
- Hidden setup gesture opens setup only when the authenticated UID owns the current channel.
- On an unauthenticated spectator device, the same long-press exposes no setup controls.

The GitHub Pages origin must be added to Firebase Authentication authorized domains.

## Firebase Security Rule intent

- `channels/<channelId>`: public read.
- Writes allowed only when `auth.uid` equals the owner UID recorded for that channel.
- Owner mapping is not publicly writable.
- Card values are validated against the supported deck.
- Ownership cannot be modified through the spectator/public path.

## Performance-critical write flow

1. Performer enters hidden setup.
2. Performer taps one of 52 cards.
3. Performer presses Done.
4. Client writes `cardCode`, `updatedAt`, and version.
5. UI waits for the Firebase write Promise to resolve.
6. Only after server commit is confirmed does setup report success/close.

## Spectator read flow

1. Spectator scans the fixed QR.
2. GitHub Pages serves the static app.
3. App parses `channelId` from `?c=`.
4. App performs a fresh one-time Firebase read.
5. Map `cardCode` to the corresponding local static photo asset.
6. Render the image without performer controls or app-like result chrome.

## GitHub Pages deployment shape

Recommended:
- static frontend source in the existing repository;
- a build step configured for base path `/Magic/`;
- GitHub Actions workflow uploads only the built output as the Pages artifact;
- card assets use base-path-safe URLs;
- no dependency on a backend web server for routing.

## State lifecycle

Selected card persists until performer explicitly changes it.

No automatic expiry.
No scan consumption.
No automatic reset.

## Performer provisioning v1

For the first vertical slice:
- create performer Firebase Auth account manually;
- create one channel ID manually;
- bind channel owner UID manually;
- add the GitHub Pages domain to Firebase Auth authorized domains.

Do not build self-service performer registration yet.

## Failure behavior

### Performer offline / failed commit

- Done must not report success.
- Keep setup visible and show a discreet performer-only connection/error state.
- Never assume a queued local write is live for the audience.

### Spectator read failure

- Do not expose technical/backend details.
- Show a neutral image-load failure/retry state.
- Do not reveal performer controls.

## Vertical-slice acceptance tests

1. Correctness: 50 consecutive card changes, zero incorrect reveal after Done has resolved.
2. Persistence: reload spectator page and still obtain the current selected card.
3. Isolation: two channel IDs operated in parallel, zero cross-channel leakage.
4. Authorization: unauthenticated and wrong-owner write attempts are rejected.
5. Hidden setup: unauthenticated spectator long-press exposes no setup UI.
6. Latency target: measure Done-resolved → second-device fresh read; working target is p95 under 1 second on normal Wi-Fi/4G.
7. Reconnect: temporarily disconnect performer device; Done must not falsely indicate live success.
8. Pages pathing: direct QR load under `/Magic/?c=...` must load correctly from a cold browser session.
9. Auth origin: Firebase Auth must operate correctly from the GitHub Pages domain.

## Fallback trigger

Reconsider Cloudflare Durable Objects if Firebase testing shows unacceptable stale reads, propagation latency, access-control friction, or operational constraints.

GitHub Pages remains the preferred frontend host unless live testing shows a hosting-specific blocker.
