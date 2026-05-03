# syntax=docker/dockerfile:1.7
# ─── deps stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
# Build tools fallback in case better-sqlite3 has no matching prebuild
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install --no-audit --no-fund; \
    fi

# ─── builder stage ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── runner stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat tini && \
    addgroup -S nodejs && adduser -S nextjs -G nodejs && \
    mkdir -p /data && chown nextjs:nodejs /data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]

LABEL org.opencontainers.image.title="LIQAA Meet"
LABEL org.opencontainers.image.description="Open-source video meeting platform · self-host in 60 seconds · in-browser AI captions"
LABEL org.opencontainers.image.source="https://github.com/hartemyaakoub/liqaa-meet"
LABEL org.opencontainers.image.licenses="AGPL-3.0-or-later"
LABEL org.opencontainers.image.vendor="TKAWEN"
