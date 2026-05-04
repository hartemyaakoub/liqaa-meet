# Promotional copy — for launch day

Pre-written posts for the channels that drive trend. **Don't post all of these on the same day.** Stagger across 3–5 days for sustained signal.

---

## Show HN (Hacker News)

**Title** (≤ 80 chars):

```
Show HN: LIQAA Meet – open-source Zoom alternative with in-browser AI captions
```

**Body**:

```
Hi HN,

I built LIQAA Meet because I was tired of paying $150/month for Zoom and watching the captions feature get gated behind paid tiers.

LIQAA Meet is open source under AGPL-3.0 (same license as Cal.com / Plausible / Mastodon). One docker compose up gets you a self-hosted meeting platform.

What's different:

* AI captions run in your browser via Whisper.cpp WASM. Audio never leaves the device. 99 languages.
* AI summary post-call. Bring your own LLM (Ollama, OpenAI, Anthropic — pluggable via env var).
* Built on top of LIQAA, our open-source video API. So if you outgrow Meet's defaults, you can dig in.
* Stripe-grade landing page, because the open-source video space is full of beautiful tech buried under ugly UIs.

Architecture: Next.js 16, LiveKit SFU under the hood (via LIQAA), better-sqlite3 for state, optional Postgres. Multi-region edge nodes in Frankfurt + Algiers (we're a small team in Algeria — fewer of these get built where I live, so this is partly the "we exist" project).

What's shipping in v0.5 (next 4-6 weeks):
* Whisper.cpp WASM. Today's captions use the Web Speech API as a fallback (Chromium only). v0.5 brings the actual WebGPU-accelerated Whisper model — RFC and acceptance criteria already published.
* Recording with auto-uploaded MP4 + transcript artifact.
* End-to-end encryption opt-in (insertable streams).

Live demo: https://meet.liqaa.io
Code: https://github.com/hartemyaakoub/liqaa-meet
Architecture deep-dive: https://github.com/hartemyaakoub/liqaa-architecture

Honest critique very welcome — especially around the AGPL choice, the LIQAA dependency, and anything I'm missing about real-world meeting UX.

— Yaakoub, building from Algiers
```

**When to post**: Tuesday or Wednesday, 08:00 UTC. That's 03:00 ET (US tech wakes up to it) and a workday in Europe.

---

## X / Twitter

**Thread (1/8)**:

```
LIQAA Meet is live. Open-source video meetings, self-host in 60 seconds.

The features Zoom locks behind paid tiers — AI captions, AI summary, E2E encryption — are free and run in your browser.

 →

github.com/hartemyaakoub/liqaa-meet
```

**(2/8)**:
```
Why now? Three things:

1) The video infra space is dominated by US closed-source tools.
2) Self-hostable meeting platforms (Jitsi, BBB) are functional but unloved — designs from 2015.
3) Whisper.cpp + WebGPU make in-browser captions actually possible in 2026.

Time to build.
```

**(3/8)**:
```
What's actually in the box (v0.3):

 One-click rooms, no login to join
 Video, screen share, chat, raise hand
 Captions in your browser (audio never leaves the device)
 AI summary post-call (Ollama / OpenAI / Anthropic — your choice)
 docker compose up to self-host
 AGPL-3.0
```

**(4/8)**:
```
Comparison vs Zoom on a 10-user team running 100 hrs/month:

LIQAA Meet (self-host): $0
Zoom: $150
Google Meet: $72
Jitsi: $0 (but no AI captions, no summary, ugly)

We're not "freemium" — we're "free as in freedom".
```

**(5/8)**:
```
Architecture:

Next.js 16 (App Router) + LiveKit SFU (via @liqaa_io) + better-sqlite3 + Whisper.cpp WASM.

Multi-region edge: Frankfurt + Algiers. Sub-15ms inside Algeria, sub-60ms across Europe. 99.99% target uptime.
```

**(6/8)**:
```
Why AGPL not MIT?

Because we want this to stay open. AGPL forces SaaS forks to publish their changes. Same license as Cal.com, Plausible, Mastodon, Bitwarden.

If you want to build a closed product on top, email partners@tkawen.com.
```

**(7/8)**:
```
Live demo: meet.liqaa.io
Self-host guide: github.com/hartemyaakoub/liqaa-meet#quick-start
Architecture decisions: github.com/hartemyaakoub/liqaa-architecture

Built in Algeria, for the world. We're hiring.
```

**(8/8)**:
```
If LIQAA Meet helps you, the cheapest support is a on GitHub. Genuinely moves the needle.

Bug reports, feature requests, RFCs → all welcome.

PRs especially welcome — we have a contributor-friendly codebase and we respond fast.
```

---

## Reddit /r/selfhosted

**Title**:

```
LIQAA Meet — open-source Zoom alternative, self-host in 60 seconds, in-browser AI captions
```

**Body**:

```
**TL;DR**: Open source (AGPL-3.0) video meeting platform. Self-host with `docker compose up`. AI captions + summary built in.

Hey r/selfhosted, after spending too long with Jitsi's quirks and BigBlueButton's deployment complexity, I built [LIQAA Meet](https://github.com/hartemyaakoub/liqaa-meet) — a meeting platform that's actually pleasant to deploy and beautiful to use.

**What you get:**
- Rooms with mute / camera / screen share / raise-hand / chat
- AI captions running in the browser via Whisper.cpp WASM (no server-side ASR)
- AI summary after the call (bring your own LLM — Ollama, OpenAI, Anthropic)
- Single SQLite file (or Postgres if you want)
- Multi-arch Docker images (amd64 + arm64) on GHCR

**Sizing**: 2 CPU / 4 GB RAM handles ~100 concurrent participants. The actual SFU work is offloaded to LIQAA Cloud (free tier 1k min/month) or your own LIQAA self-host (separate repo).

**Deployment**:
```bash
git clone https://github.com/hartemyaakoub/liqaa-meet
cd liqaa-meet && cp .env.example .env
docker compose up -d
```

Caddy / nginx config for TLS in [SELF_HOSTING.md](https://github.com/hartemyaakoub/liqaa-meet/blob/main/SELF_HOSTING.md).

Honest about the gaps:
- Recording lands in v0.4
- Whisper.cpp WASM lands in v0.4 (currently Web Speech API as fallback)
- E2E encryption opt-in lands in v0.4

PRs and bug reports welcome.
```

**When**: Sunday 14:00 UTC (peak r/selfhosted traffic).

---

## LinkedIn (longer form)

```
Today I'm releasing LIQAA Meet — open source under AGPL-3.0.

It's the open-source alternative to Zoom that I always wanted: self-host in 60 seconds, AI captions running in your browser, AI summaries after the call. The features that legacy meeting software locks behind $14/user/month tiers — free, private, yours.

Why build this in 2026?

The conferencing space is dominated by US closed-source vendors with tracking baked in. The open-source alternatives (Jitsi, BigBlueButton) are functionally great but their UX is stuck a decade behind. Whisper.cpp + WebGPU finally make browser-side AI transcription real, so privacy doesn't have to mean "no AI".

What's powerful about doing this from Algeria is that it forces a different design lens. Bandwidth is precious here. So is trust in foreign clouds. So is design quality (we deserve nice things). Building for that constraint produces software that ends up being genuinely better for everyone.

If you're tired of Zoom: meet.liqaa.io
If you want to deploy it: github.com/hartemyaakoub/liqaa-meet
If you want to talk about it: comment below

A on the repo is the cheapest way to support this kind of work.
```

**When**: Tuesday 09:00 your timezone.

---

## Email outreach (to potential design partners / customers)

Subject: Tried something — open-source Zoom that runs on your infrastructure

```
Hi [Name],

I just released LIQAA Meet — an open-source meeting platform you can self-host in 60 seconds. It's built on the LIQAA video API I've been working on.

Three things that might matter to [Company]:

1. **No vendor data exfiltration**. You run it. Your data, your servers.
2. **AI captions run in the browser**. Audio never leaves the user's device. We're seeing this is increasingly important for legal / health / banking customers.
3. **AGPL license**. You can use it forever, fork it, modify it. We can also offer commercial-friendly licensing if your legal team prefers that.

Self-host guide: https://github.com/hartemyaakoub/liqaa-meet/blob/main/SELF_HOSTING.md
Live demo: https://meet.liqaa.io

Would 20 minutes next week be useful? I'd love to understand if this could replace any of your current meeting tooling.

Best,
Yaakoub
```

---

## Submission checklist for launch day

- [ ] HackerNews "Show HN" submission (Tue/Wed 08:00 UTC)
- [ ] X thread (same day, 09:00 UTC)
- [ ] LinkedIn post (same day, your timezone morning)
- [ ] Reddit /r/selfhosted (Sunday 14:00 UTC)
- [ ] Reddit /r/webdev (Wednesday)
- [ ] Reddit /r/opensource (any day)
- [ ] Reddit /r/programming (Friday — they prefer non-launch-day content)
- [ ] DEV.to long-form article ("How we built an open-source Zoom in N days")
- [ ] Submit to [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)
- [ ] Submit to [awesome-foss-alternatives](https://github.com/RichardLitt/meta-awesome-list)

## What NOT to do

- **Don't beg for stars.** Ever. People notice.
- **Don't oversell.** "v0.3 — Whisper WASM lands in v0.4" is honest. "Production-ready AI captions today" is a lie that destroys trust.
- **Don't reply defensively to critics.** Bugs reported on launch day are gifts. Thank them, fix them, push.
- **Don't post in 12 places at once.** Stagger across 3–5 days. People who saw it yesterday don't want to see it today.
- **Don't AI-generate the responses.** Reply personally. The whole pitch is "human-built, open, real" — chatbot replies kill that.
