# Security policy

## Supported versions

We only patch security issues on the latest minor version. Self-hosters are expected to keep up to date.

| Version | Status     |
| ------- | ---------- |
| 0.3.x   | ✅ supported |
| < 0.3   | ❌ not supported |

## Reporting a vulnerability

**Do not file a public issue.** Email [security@liqaa.io](mailto:security@liqaa.io) with:

- A description of the issue
- Steps to reproduce
- Affected version(s)
- Your assessment of severity (low / medium / high / critical)

PGP key (optional): published at [`liqaa.io/.well-known/pgp.asc`](https://liqaa.io/.well-known/pgp.asc).

## Response SLA

| Severity | First response | Patch timeline |
| -------- | -------------- | -------------- |
| Critical | 24 hours       | 7 days         |
| High     | 48 hours       | 14 days        |
| Medium   | 5 days         | 30 days        |
| Low      | 14 days        | next release   |

We will keep you informed at every step. We disclose publicly only after a patch is released.

## Scope

In scope:
- The `liqaa-meet` codebase in this repo
- Default Docker images at `ghcr.io/hartemyaakoub/liqaa-meet`
- The hosted instance at `meet.liqaa.io`

Out of scope (report to the right team):
- LIQAA Cloud API → [security@liqaa.io](mailto:security@liqaa.io) (yes, same address — we triage)
- Dependencies (Next.js, LiveKit, …) → upstream security teams

## Bounty

We don't run a formal bounty program yet. We do publicly thank reporters in the changelog and on [`liqaa.io/security`](https://liqaa.io/security).

For exceptional findings (RCE, auth bypass, full data exfil), we send swag and a hand-written thank-you letter from a small Algerian startup — and credit you wherever you'd like, including in your CV.

## Hardening

Self-hosters should read [`SELF_HOSTING.md` § Hardening](../SELF_HOSTING.md#hardening) before exposing the service publicly.
