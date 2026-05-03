# Changelog

All notable changes to LIQAA Meet are documented here. Format follows [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer 2.0](https://semver.org).

## [0.3.0] — 2026-05-03

### Added
- Initial public release.
- Landing page with comparison table vs Zoom, Google Meet, Jitsi.
- Room creation flow at `/new` — three-segment lowercase codes (`xyz1-abc2-def3`).
- Meeting room at `/r/[code]` with lobby, video tiles, mute / camera / captions controls.
- In-browser captions component (Web Speech API now; Whisper.cpp WASM tracked for v0.4).
- AI summary endpoint at `/api/summary` supporting Ollama, OpenAI, and Anthropic providers.
- Recap page at `/r/[code]/recap` with Markdown summary + collapsible full transcript.
- HMAC-signed webhook endpoint at `/api/webhooks/liqaa` (constant-time verify, 5-min replay window).
- SQLite by default, Postgres-ready via `DATABASE_URL`.
- `docker compose up` deployment with optional Ollama LLM container.
- `next.config.mjs` ships hardened security headers (COOP, COEP, Permissions-Policy).
- `SELF_HOSTING.md`, `CONTRIBUTING.md`, `docs/architecture.md`.
- AGPL-3.0 license.

### Roadmap target for v0.4
- Server-side recording with auto-uploaded MP4 + transcript.
- Replace Web Speech API fallback with Whisper.cpp WASM + WebGPU.
- E2E encryption opt-in via LIQAA Pro.
