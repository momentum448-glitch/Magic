# Trick 01 — Backend Research

Date: 2026-09-30
Status: **CLOSED FOR V1 — GITHUB-ONLY SELECTED**

## Final v1 choice

The project owner selected a GitHub-only architecture:

- GitHub Pages for frontend/static assets.
- GitHub REST Contents API for mutable shared state.
- Fine-grained PAT for performer writes.
- Public unauthenticated API reads for spectators.
- Dedicated public state repo recommended: `momentum448-glitch/Magic-state`.

Firebase, Cloudflare Durable Objects, and Supabase are retained only as historical alternatives.

## Official GitHub constraints relevant to v1

### Contents API

Public repository content can be read without authentication.

Creating or updating repository file contents supports fine-grained PATs with `Contents: write`. Updating an existing file requires the current file blob SHA.

### Rate limits

Current primary REST API limits:
- unauthenticated public requests: 60/hour per originating IP;
- authenticated requests using a personal access token: 5,000/hour.

This is enough for prototype/small-show testing but must be measured on shared venue Wi-Fi.

### GitHub Pages

GitHub Pages is static hosting and supports deployment through custom GitHub Actions workflows. The Magic site remains a project site under `/Magic/`, so query-based channel URLs remain the preferred route format.

## Key risks to test

1. GitHub API fresh-read latency after a successful write.
2. Browser/CDN stale-read behavior.
3. Venue-IP unauthenticated rate limits.
4. Commit churn from every card change.
5. PAT storage and local-device compromise.
6. 409 conflicts from simultaneous file updates.

## Security conclusion

A separate state repo is recommended because a fine-grained PAT's Contents write permission is repository-scoped. The state token should never have write access to the main app repo.
