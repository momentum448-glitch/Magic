# Trick 01 — Architecture v1

Date: 2026-09-30
Status: **LOCKED FOR GITHUB-ONLY VERTICAL SLICE**

## Stack

- Main code repo: `momentum448-glitch/Magic`.
- Frontend/static assets: GitHub Pages.
- Deploy: GitHub Actions.
- Mutable shared state: GitHub REST Contents API.
- State repo: dedicated public repo, recommended `momentum448-glitch/Magic-state`.
- Performer credential: fine-grained GitHub PAT scoped only to the state repo with `Contents: write`.
- Spectator authentication: none.
- External backend/database: none.

## Public QR URL

`https://momentum448-glitch.github.io/Magic/?c=<channelId>`

The QR is stable and reusable.

## State repository

Recommended layout:

```
Magic-state/
  channels/
    performer01.json
    performer02.json
```

Example:

```json
{
  "cardCode": "7D",
  "version": 12,
  "updatedAt": "2026-09-30T09:20:00Z"
}
```

## Performer token model

The performer uses a fine-grained PAT:
- repository access: only `Magic-state`;
- repository permission: `Contents: write`;
- no Actions, Administration, Secrets, or Workflow permission;
- never committed to either repository;
- never included in the GitHub Pages artifact.

For v1, the app may store the token locally on the performer's own device after explicit opt-in. This is a convenience/security trade-off to validate during QC. Repo isolation limits the blast radius if that token is exposed.

## Hidden setup flow

1. Performer opens the same Pages URL/channel on their own phone.
2. Performer taps the setup hotspot 5 times.
3. During prototype/QC, the hotspot is intentionally visible and shows tap progress; after the flow is proven, it will be visually hidden while keeping the same 5-tap gesture.
4. If the performer device has no session token, the 5th tap opens the Arm dialog instead of failing silently.
5. After successful Arm from this path, the 52-card setup opens automatically.
6. Performer selects one of 52 cards.
7. Press Done.
8. App calls GET Contents API for `channels/<channelId>.json` to obtain current blob SHA.
9. App sends PUT Contents API with the new Base64-encoded JSON and that SHA, authenticated with the PAT.
10. On HTTP 200/201, Done succeeds and setup closes.
11. On HTTP 409, app re-fetches SHA and retries once.
12. On failure, setup stays open and does not claim success.

GitHub requires `Contents: write` for create/update file contents.

## Spectator flow

1. Spectator scans QR.
2. GitHub Pages app loads.
3. Parse `?c=<channelId>`.
4. Perform unauthenticated GET Contents API request against public `Magic-state`.
5. Use browser `cache: "no-store"` and fresh request behavior.
6. Decode JSON.
7. Map `cardCode` to local static photograph.
8. Render only the photographic reveal.

No token is sent from the spectator device.

## Rate-limit model

GitHub's current primary REST API limit for unauthenticated public requests is 60 requests/hour per originating IP.

Implication:
- acceptable for v0/small-show testing;
- venue Wi-Fi can aggregate many spectators behind one public IP;
- rate-limit behavior is an explicit S2 acceptance test;
- this architecture is not yet approved for high-volume public deployment.

Authenticated performer API calls have a much higher primary limit, so performer writes are not expected to be rate-limited in ordinary show use.

## Security model

- Main repo token exposure risk is avoided by using a separate state repo.
- PAT is never embedded in source or build output.
- State repo is public because spectator reads are unauthenticated.
- Public state should contain only minimal trick state, never secrets or personal data.
- Knowing the state repo/API can reveal the current card to a technically inspecting spectator; v1 relies on obscurity of implementation, not cryptographic secrecy.
- If stronger secrecy becomes required, GitHub-only client architecture will no longer be sufficient and a backend-controlled design should be reconsidered.

## GitHub Pages deployment

- Existing `Magic` repo.
- Base path `/Magic/`.
- GitHub Actions publishes only built static artifact.
- Static route uses query string, no server rewrite dependency.

## State lifecycle

- Card persists until performer changes it.
- No TTL.
- No one-scan consumption.
- No automatic reset.

## Vertical-slice acceptance

1. 50 consecutive card changes, zero wrong reveal after successful Done.
2. Second device must fetch latest card after Done.
3. Refresh preserves selected card.
4. Two channel files show zero leakage.
5. Simulated update conflict is recovered by SHA re-fetch + one retry.
6. Token is absent from repository and Pages artifact.
7. Spectator makes no authenticated request.
8. Observe GitHub `x-ratelimit-remaining` during public reads.
9. Pages cold-load at `/Magic/?c=...` succeeds.
10. Measure Done-success → fresh spectator read latency.

## Evidence-based fallback

If GitHub API latency, caching, rate limits, commit churn, or client-side token handling fail live-show QC, revisit a small real backend. That fallback is not active in v1.
