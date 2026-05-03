<div align="center">

# 🎥 LIQAA Meet

**The open-source video meeting platform you can self-host in 60 seconds.**
Real-time AI captions in 100+ languages — running entirely in your browser.

[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-1d4ed8?style=flat-square)](./LICENSE)
[![Self-host](https://img.shields.io/badge/self--host-1%20command-10b981?style=flat-square)](./SELF_HOSTING.md)
[![Stars](https://img.shields.io/github/stars/hartemyaakoub/liqaa-meet?style=flat-square&color=eab308)](https://github.com/hartemyaakoub/liqaa-meet/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-7c3aed?style=flat-square)](./CONTRIBUTING.md)

[**🌐 Live demo: meet.liqaa.io**](https://meet.liqaa.io) · [**📦 Self-host**](./SELF_HOSTING.md) · [**🐙 Twitter**](https://x.com/liqaa_io)

</div>

---

## Why LIQAA Meet exists

Zoom is bloated. Google Meet locks you into Google. Jitsi is functional but unloved. Microsoft Teams ships malware-grade tracking. Whereby costs $90/month for a small team.

In 2026, the world's video infrastructure deserves to be:

- 🔓 **Open source** — read every line, fork it, ship your own
- 🏠 **Self-hostable** — your data, your servers, your rules
- 🎨 **Beautiful** — Stripe-grade design isn't optional anymore
- 🤖 **AI-native** — captions, summaries, translation in 100+ languages
- 🛡 **Privacy-first** — captions run in *your browser*, never sent to a server
- ⚡ **Fast** — Next.js 16 + LiveKit SFU + WASM = sub-second time-to-video

That's LIQAA Meet.

## Features

### The basics done right

- ✅ **No-install join** — share a link, click, you're in
- ✅ **HD video, simulcast** — adapts to bad connections
- ✅ **Screen share** with audio (Chromium + Edge + Firefox)
- ✅ **Raise hand**, react with emojis, in-call chat
- ✅ **Breakout rooms** for up to 50 simultaneous splits
- ✅ **Cloud or self-host** — same experience, your choice

### The killer features

| | LIQAA Meet | Zoom | Google Meet | Jitsi |
| --- | --- | --- | --- | --- |
| **In-browser AI captions** (no server) | ✅ Whisper.cpp WASM + WebGPU | ❌ (server-side, paid) | ❌ (server-side) | ❌ |
| **AI summary** after the call | ✅ local Ollama or any API | ❌ ($14/mo Pro) | ❌ (Workspace add-on) | ❌ |
| **Self-hostable** | ✅ `docker compose up` | ❌ | ❌ | ✅ (complex) |
| **End-to-end encrypted by default** | ✅ | ❌ (only paid Pro+) | ⚠️ partial | ⚠️ optional |
| **Bring your own LLM** | ✅ Ollama, OpenAI, Anthropic, llama.cpp | ❌ | ❌ | ❌ |
| **Open source** | ✅ AGPL-3.0 | ❌ | ❌ | ✅ Apache-2.0 |
| **Cost (10 users, 100 hrs/mo)** | **$0 self-hosted** | $150 | $72 | $0 |

## Quick start

### Option 1 — Hosted (free)

```
Open https://meet.liqaa.io
Click "New room"
Share the link
```

That's it. No account. No download.

### Option 2 — Self-host

You need: Docker. That's all.

```bash
git clone --depth 1 https://github.com/hartemyaakoub/liqaa-meet.git
cd liqaa-meet
cp .env.example .env
# Edit .env: set MEET_DOMAIN to your domain (or "localhost:3000")
docker compose up -d
```

Open `http://localhost:3000`. Done.

For production deployment with TLS, see [`SELF_HOSTING.md`](./SELF_HOSTING.md).

### Option 3 — Use as a library

Embed LIQAA Meet rooms in your own SaaS:

```tsx
import { MeetRoom } from '@liqaa/meet';

<MeetRoom
  roomCode="abc-defg-hij"
  user={{ name: 'Alice', email: 'alice@example.com' }}
  features={{ captions: true, summary: true, recording: false }}
  liqaaEndpoint="https://your-self-hosted-liqaa.com"
/>
```

## How AI captions work (no server, really)

Most video platforms send your audio to *their* servers, transcribe it there, send it back. We don't.

```
Your microphone
      │
      ▼
  Web Audio API → 16 kHz PCM
      │
      ▼
  Web Worker (off main thread)
      │
      ▼
  Whisper.cpp compiled to WebAssembly
      │
      ▼
  WebGPU acceleration (fallback: WASM SIMD)
      │
      ▼
  Captions render locally
```

The Whisper model (39 MB for `tiny`, 142 MB for `base`) is cached after first load. Inference: ~200 ms for 1 second of audio on M1 / Ryzen 5 laptops. Your audio never leaves the browser.

**Languages:** Whisper supports 99 — Arabic, French, English, Spanish, Mandarin, German, Russian, Hindi, Portuguese, Japanese, Korean, Italian, Turkish, Polish, Dutch, Hebrew, Greek, Persian, Swahili — and 80 more.

## How AI summary works

After the call, the captions transcript is sent to your configured LLM:

- **Default**: local Ollama (`llama3.2:3b`) — runs on your laptop, free, private
- **Or**: OpenAI / Anthropic / Google / any OpenAI-compatible API — set `LLM_PROVIDER=openai`
- **Or**: nothing — turn it off entirely with `FEATURE_SUMMARY=false`

The summary covers:

- 📋 **Decisions made** — bulleted list
- ✅ **Action items** — assigned to the person who said them
- ❓ **Open questions** — flagged for follow-up
- 📑 **Full transcript** — searchable, editable, exportable as .md / .pdf

## Architecture

```
                  ┌──────────────────────────┐
                  │   meet.liqaa.io          │
                  │   (this repo, Next.js)   │
                  └──────────┬───────────────┘
                             │
                             ├──── /api/sdk-token ──────┐
                             │                           ▼
                             │                    ┌────────────────┐
                             │                    │  LIQAA Cloud   │
                             │                    │  (or self-host)│
                             │                    └───────┬────────┘
                             │                            │ JWT
                             │                            ▼
                             │                    ┌────────────────┐
                             │                    │  LiveKit SFU   │
                             │                    │  (eu-central + │
                             │                    │   dz-algiers)  │
                             │                    └────────────────┘
                             │
                             ├──── /api/rooms ──────────► SQLite
                             │                            (via Drizzle)
                             │
                             └──── /api/summary ────────► Ollama / OpenAI / Anthropic
```

For the full design, see [`docs/architecture.md`](./docs/architecture.md).

## Self-hosting

Three deployment recipes:

1. **Single VPS** — one `docker compose up`, suitable for ≤500 concurrent users
2. **Kubernetes** — Helm chart at [`deploy/helm/`](./deploy/helm/) (community-maintained)
3. **Vercel + LIQAA Cloud** — push to Vercel, point at `api.liqaa.io`, done

Full guide: [`SELF_HOSTING.md`](./SELF_HOSTING.md).

## Roadmap

- [x] **v0.1** — basic rooms, screen share, chat
- [x] **v0.2** — in-browser whisper captions
- [x] **v0.3** — AI summary
- [ ] **v0.4** — recording with auto-uploaded MP4 + transcript
- [ ] **v0.5** — virtual backgrounds (MediaPipe in browser)
- [ ] **v0.6** — live translation (Whisper → 99 languages → display)
- [ ] **v0.7** — calendar invites, ICS export, scheduling
- [ ] **v1.0** — production-ready release with SLA-eligible self-host package

Track issues at [github.com/hartemyaakoub/liqaa-meet/issues](https://github.com/hartemyaakoub/liqaa-meet/issues).

## Built on LIQAA

LIQAA Meet uses the [LIQAA video API](https://liqaa.io) for media routing. The `meet.liqaa.io` hosted version runs on LIQAA Cloud; self-hosted versions can either:

- **Use LIQAA Cloud** (free up to 1,000 minutes/month) — set `LIQAA_PK` and `LIQAA_SK` in `.env`
- **Use your own LIQAA self-host** — clone [hartemyaakoub/liqaa-architecture](https://github.com/hartemyaakoub/liqaa-architecture) for the full stack

You can also fork LIQAA Meet and swap LIQAA for any LiveKit-compatible SFU.

## Why AGPL-3.0?

We chose AGPL-3.0 (not MIT, not Apache) on purpose:

- **You can self-host LIQAA Meet for your company** — for free, forever.
- **You can fork it and modify it** — go wild.
- **You can build a paid SaaS on top of it** — but you must publish your modifications.

The AGPL is the same license as Cal.com, Plausible Analytics, Mastodon. It guarantees the project stays open. If you need a commercial-friendly license for a closed product, [contact us](mailto:partners@tkawen.com).

## Contributing

We welcome PRs. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) — TL;DR: open an issue first for non-trivial work, follow the linter, ship tests when you ship code.

## Star history

If LIQAA Meet helps you, the cheapest way to support us is a ⭐. It actually moves the needle in GitHub trending.

[![Star History Chart](https://api.star-history.com/svg?repos=hartemyaakoub/liqaa-meet&type=Date)](https://star-history.com/#hartemyaakoub/liqaa-meet&Date)

## License

[AGPL-3.0](./LICENSE) — © 2026 TKAWEN, Algeria. Built in 🇩🇿 for the world.

---

<div align="center">

[Website](https://liqaa.io) · [Docs](https://liqaa.io/docs) · [Architecture](https://github.com/hartemyaakoub/liqaa-architecture) · [Examples](https://github.com/hartemyaakoub/liqaa-examples) · [Status](https://github.com/hartemyaakoub/liqaa-status) · [Hire us](mailto:partners@tkawen.com)

</div>
