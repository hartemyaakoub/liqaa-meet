# LIQAA Meet · architecture

A short tour for engineers reading this codebase for the first time.

## The big picture

```

 Browser (the user's laptop / phone)


 Next.js 16 client
 • landing
 • /r/[code] room UI
 • Captions component (worker)




 Web Audio API + whisper.wasm
 getUserMedia Web Worker
 (mic, camera) (off main)


 DTLS-SRTP encrypted media




 LIQAA Cloud / your self-hosted LIQAA

 LiveKit SFU mesh (eu-central + dz-algiers)
 forwards media to other peers



 Next.js 16 server (this repo)

 /api/rooms POST /v1/rooms
 /api/sdk-token POST /v1/sdk-token
 /api/summary POST → LLM provider
 /api/webhooks/ verify HMAC,
 liqaa persist events

 SQLite (default) / Postgres (production)

```

## Why each piece is there

### Next.js 16 (App Router)

- **Why:** server components let us render the recap page server-side with the database read, and dynamically code-split the room UI. Plus we get nginx-grade caching and the standalone build output for cheap Docker images.
- **Why not Remix:** mostly familiarity. Both would work.
- **Why not Astro:** Astro shines for content-heavy sites; the room UI is fully interactive.

### LIQAA SDK (`@liqaa/js`)

- **Why:** we don't reimplement WebRTC. The LIQAA SDK + LiveKit SFU handle media; we focus on the meeting UX.
- **Coupling risk:** if you want a different SFU, the integration point is `lib/liqaa.ts`. Swap the contents and re-deploy. The rest of the app doesn't care.

### whisper.cpp WASM (in browser)

- **Why:** privacy. Your audio never leaves your device. This is the headline feature.
- **Performance:** ~200 ms inference per 1 second of audio on M1 / Ryzen 5 laptops with WebGPU. Without WebGPU we fall back to WASM SIMD (~600 ms / sec). Without either we degrade gracefully to the Web Speech API (Chromium only) or disable captions.
- **Model:** `tiny` (39 MB, multilingual) loaded once and cached in IndexedDB. Larger models (`base` 142 MB, `small` 466 MB) are opt-in via env var.

### SQLite by default, Postgres for production

- **Why SQLite:** zero ops. `docker compose up` works on a Raspberry Pi.
- **Why Postgres optional:** Vercel serverless can't write SQLite, and any deployment that scales > 1 process needs a real DB.
- **Drizzle ORM:** type-safe queries, both backends share the same schema.

### Ollama / OpenAI / Anthropic for summaries

- **Why pluggable:** opinions about LLM providers are religious. Default to Ollama (local, free, private), let users swap in OpenAI / Anthropic / any OpenAI-compatible endpoint via env vars.
- **Why post-call, not in-call:** in-call summarisation is an interesting feature for v1.0, but it tanks the LLM cost story. Post-call summarisation is one ~5,000-token request per meeting.

### AGPL-3.0 license

- **Why:** the project must stay open. AGPL forces SaaS providers who fork us to publish their changes. MIT/Apache lets BigCorp take our work, ship it as a closed product, and contribute nothing back. We've watched it happen to too many projects. No more.
- **Same license as:** Cal.com, Plausible, Mastodon, Bitwarden, Grafana.

## Code map

```
liqaa-meet/
 app/
 layout.tsx # OG meta + global font import
 page.tsx # landing
 globals.css # tokens (--brand, --slate-*) + reusable classes
 new/page.tsx # "Start a meeting" form
 r/[code]/
 page.tsx # SSR — verifies the room exists
 room.tsx # client — the actual UI
 recap/page.tsx # post-call summary (SSR)
 api/
 rooms/ # POST → liqaa.createRoom + db write
 sdk-token/ # POST → liqaa.issueToken
 summary/ # POST → LLM provider, persists summary
 webhooks/liqaa/ # POST ← LIQAA, HMAC verify
 healthz/ # GET → 200 OK
 components/
 ComparisonTable.tsx # the landing-page truth table
 Captions.tsx # captions hook (worker-backed)
 lib/
 liqaa.ts # the only place we talk to LIQAA HTTP API
 db.ts # better-sqlite3 + schema
 ids.ts # room code generator
 docs/
 architecture.md # this file
 docker-compose.yml
 Dockerfile # multi-stage, distroless-ish, ~120 MB final
 next.config.mjs # standalone output + security headers
 package.json
 tsconfig.json
```

## Data model

```sql
CREATE TABLE rooms (
 code TEXT PRIMARY KEY, -- xyz1-abc2-def3
 created_at INTEGER NOT NULL,
 created_by TEXT, -- nullable: anon-friendly
 title TEXT,
 ended_at INTEGER,
 summary TEXT, -- markdown
 transcript TEXT -- raw, line-separated
);

CREATE TABLE participants (
 room_code TEXT REFERENCES rooms(code),
 user_id TEXT NOT NULL, -- u_xxxxxxxx
 name TEXT NOT NULL,
 joined_at INTEGER NOT NULL,
 left_at INTEGER,
 PRIMARY KEY (room_code, user_id)
);
```

That's the entire schema. We resist adding tables until a feature truly needs one.

## Threat model (informal)

- **Attacker on the network:** all traffic is TLS; media is DTLS-SRTP. We refuse to start a call without HTTPS in production.
- **Attacker with the room URL:** they can join. Rooms are public-by-link. For higher-trust rooms, the v0.5 roadmap adds optional pre-shared passcodes.
- **Attacker hitting the API:** all mutating endpoints validate the room code format and existence; rate-limiting is at the proxy layer.
- **Attacker pretending to be LIQAA:** webhook endpoint requires HMAC signature with `LIQAA_WEBHOOK_SECRET`. Replay window is 5 minutes.
- **LIQAA itself:** sees encrypted media headers (room IDs, timing) but cannot decrypt media if E2E is enabled (v0.4).

## Performance notes

- Landing page: no JS beyond what Next.js needs. Lighthouse 100/100/100/100 target.
- Room page: ~80 KB gzipped JS (LIQAA SDK is the dominant cost).
- Time-to-video on a fresh laptop: < 1.5 s after granting camera permissions.
- The whisper worker downloads the model once (39 MB tiny), cached forever.

## What's not here yet

- Recording (v0.4)
- Virtual backgrounds (v0.5)
- Live translation (v0.6)
- Calendar integrations (v0.7)
- Native mobile apps (v1.0)

The roadmap is in [README.md](../README.md). Issues track each item.
