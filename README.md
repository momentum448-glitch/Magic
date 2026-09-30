# Magic

Digital tools for live magic performance.

## Trick 01 — QR Card Reveal

Current vertical slice is GitHub-only:

- Frontend: GitHub Pages
- Deploy: GitHub Actions
- Shared state: GitHub REST Contents API
- State repository: `momentum448-glitch/Magic-state`
- Spectator URL: `https://momentum448-glitch.github.io/Magic/?c=test01`
- Performer device arm URL: `https://momentum448-glitch.github.io/Magic/?c=test01#arm`

The performer token must be a fine-grained PAT scoped only to `Magic-state` with `Contents: write`. Never commit a PAT to this repository.

Project continuity and execution status live under `project_state/`.
