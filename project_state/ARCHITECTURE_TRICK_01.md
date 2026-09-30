# Trick 01 — Architecture v1

Date: 2026-09-30
Status: **LOCKED FOR VERTICAL-SLICE IMPLEMENTATION**

## Stack

- Frontend/hosting: Firebase Hosting.
- Shared state: Firebase Realtime Database.
- Performer authentication: Firebase Authentication.
- Spectator authentication: none.
- Card images: static assets on Hosting/CDN.

## URL/channel model

Each performer owns one stable public channel ID.

Example spectator URL:

`https://<domain>/p/<channelId>`

The QR encodes that stable URL and can be printed/reused.

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

The exact physical schema may be simplified during implementation as long as the security and isolation properties remain intact.

## Access model

### Spectator

- Can read the current public state for a specific channel.
- Does not authenticate.
- Cannot write.

### Performer

- Authenticates once on their own device.
- Browser auth persistence remains local across visits unless explicitly signed out.
- Can write only the channel they own.
- Hidden setup gesture opens setup only if the current authenticated user owns the channel.
- On an unauthenticated spectator device, the same long-press must reveal no performer controls.

## Firebase Security Rule intent

- `channels/<channelId>`: public read.
- Writes allowed only when `auth.uid` equals the owner UID recorded for that channel.
- Owner mapping is not publicly writable.
- Card values must be validated to the supported deck.
- Ownership must not be client-modifiable through the spectator/public path.

## Performance-critical write flow

1. Performer enters hidden setup.
2. Performer taps one of 52 cards.
3. Performer presses Done.
4. Client writes `cardCode`, `updatedAt`, and version.
5. UI waits for the Firebase write Promise to resolve.
6. Only after server commit is confirmed does setup report success/close.

This prevents a local/offline queued write from being treated as a successful live arm.

## Spectator read flow

1. Spectator scans stable QR.
2. Page parses `channelId`.
3. Page performs a fresh one-time read for current state.
4. If successful, map `cardCode` to the corresponding static photographic reveal asset.
5. Render the image without performer controls or app-like result chrome.

A continuous realtime subscription is unnecessary for v1 because the spectator needs the state only at page load.

## State lifecycle

The currently selected card persists until the performer explicitly changes it.

No automatic expiry.
No scan consumption.
No automatic reset.

## Performer provisioning v1

For the first vertical slice:
- create performer Auth account manually;
- create one channel ID manually;
- bind channel owner UID manually in Firebase console/config.

Do not build self-service performer registration yet.

Later, if Magic becomes multi-user, add an admin/provisioning flow.

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

## Fallback trigger

Reconsider Cloudflare Durable Objects if Firebase testing shows unacceptable stale reads, propagation latency, access-control friction, or operational constraints for the live-show use case.
