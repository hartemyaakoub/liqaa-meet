# Self-hosting LIQAA Meet

There are three deployment recipes — **single VPS** (recommended for most teams), **Vercel + LIQAA Cloud** (zero ops), and **Kubernetes** (for serious scale).

## 1. Single VPS — `docker compose`

The fastest path to production. Suitable for **up to ~500 concurrent participants** depending on your VPS.

### Requirements

- A Linux VPS with **2 CPU / 4 GB RAM minimum** (4 / 8 recommended)
- Docker 24+ and Docker Compose v2
- A domain name pointing to your VPS (Cloudflare DNS is free and works great)
- Ports 80 + 443 open

### Steps

```bash
# 1. Get the code
ssh you@your-vps
git clone --depth 1 https://github.com/hartemyaakoub/liqaa-meet.git
cd liqaa-meet

# 2. Configure
cp .env.example .env
nano .env
# Set:
# MEET_DOMAIN=meet.example.com
# LIQAA_PK=pk_live_… (from https://liqaa.io/console)
# LIQAA_SK=sk_live_…
# LIQAA_WEBHOOK_SECRET=whsec_…
# LLM_PROVIDER=ollama (or openai / anthropic if you prefer cloud)

# 3. Bring up the stack
docker compose --profile with-llm up -d

# 4. Pull the LLM model (only needed for ollama)
docker compose exec ollama ollama pull llama3.2:3b
```

The app is now on `http://localhost:3000`. Put nginx / Caddy / Traefik in front for TLS:

### Caddy (one-line TLS)

Put this in `/etc/caddy/Caddyfile`:

```caddy
meet.example.com {
 reverse_proxy localhost:3000
}
```

`systemctl reload caddy`. TLS, HSTS, and HTTP/2 are automatic.

### Or nginx

```nginx
server {
 listen 443 ssl http2;
 server_name meet.example.com;

 ssl_certificate /etc/letsencrypt/live/meet.example.com/fullchain.pem;
 ssl_certificate_key /etc/letsencrypt/live/meet.example.com/privkey.pem;

 location / {
 proxy_pass http://127.0.0.1:3000;
 proxy_set_header Host $host;
 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 proxy_set_header X-Forwarded-Proto $scheme;

# WebSocket upgrades for real-time
 proxy_http_version 1.1;
 proxy_set_header Upgrade $http_upgrade;
 proxy_set_header Connection "upgrade";
 }
}
```

### Updating

```bash
git pull
docker compose pull && docker compose up -d
```

### Backup

```bash
# Just the SQLite file
docker compose cp app:/data/meet.db ./meet-backup-$(date +%F).db

# Or the whole volume
docker run --rm -v liqaa-meet_meet-data:/data -v $(pwd):/backup alpine \
 tar czf /backup/meet-data-$(date +%F).tar.gz -C /data .
```

## 2. Vercel + LIQAA Cloud — zero ops

Push the repo to Vercel, set the env vars, done. Suitable for any team size — Vercel handles scaling, LIQAA Cloud handles media. Recommended for SaaS founders who don't want to operate servers.

```bash
# Fork the repo on GitHub, then:
vercel --prod
# Set env vars in Vercel dashboard:
# LIQAA_PK, LIQAA_SK, LIQAA_WEBHOOK_SECRET
# LLM_PROVIDER=openai (or anthropic) + LLM_API_KEY
# DATABASE_URL=postgres://… (Vercel Postgres or Supabase)
```

You'll need a Postgres-compatible database (Vercel Postgres / Neon / Supabase) since SQLite doesn't work on Vercel's serverless runtime. Drizzle handles both.

## 3. Kubernetes — serious scale

The community-maintained Helm chart is at [`deploy/helm/`](./deploy/helm/) (TBD — PRs welcome).

For now, the Docker image at `ghcr.io/hartemyaakoub/liqaa-meet:latest` is multi-arch (amd64 + arm64) and ready to drop into any orchestrator.

## Sizing

Per ~100 concurrent participants (10 rooms × 10 people):

| Resource | Light usage | With AI summary on each call |
| --- | --- | --- |
| App CPU | 0.5 vCPU | 1.0 vCPU |
| App RAM | 512 MB | 1 GB |
| Ollama CPU | — | 4 vCPU (during inference bursts) |
| Ollama RAM | — | 4 GB (3B model) / 8 GB (8B model) |
| Disk | 5 GB | 10 GB |

The LIQAA SFU (which actually does the heavy media work) is hosted by LIQAA Cloud or by your own LIQAA self-host — the `liqaa-meet` app itself is light.

## Hardening

- Set `LIQAA_WEBHOOK_SECRET` to a real 32-byte random string (not the placeholder).
- Run behind a reverse proxy with TLS (Caddy / Cloudflare / nginx).
- Restrict the `/api/healthz` endpoint to your monitoring vendor's IP range if exposing publicly.
- If using Postgres, restrict access by VPC / firewall — don't expose the DB port publicly.
- Configure `next.config.mjs` `headers` to match your CSP requirements.
- Enable rate limiting at the proxy layer (Caddy `rate_limit`, nginx `limit_req`).

## Troubleshooting

**"liqaa_unreachable" when creating a room**

Your `LIQAA_API_BASE` cannot be reached, or your `LIQAA_SK` is invalid. Check:

```bash
curl -H "Authorization: Bearer $LIQAA_SK" $LIQAA_API_BASE/v1/rooms
```

**Captions don't appear**

The Web Speech API is Chromium-only without the in-browser whisper.cpp build. Until v0.4 ships the whisper WASM, captions on Safari and Firefox display "unsupported".

**Summary never generates**

Check the Ollama container is running: `docker compose ps`. Pull the model: `docker compose exec ollama ollama pull llama3.2:3b`. Confirm `LLM_BASE_URL=http://ollama:11434` in `.env`.

## Need help?

- Open an issue: https://github.com/hartemyaakoub/liqaa-meet/issues
- Ping us: [partners@tkawen.com](mailto:partners@tkawen.com)
- Sponsored deployment / SLA: same email.
