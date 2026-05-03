# Contributing to LIQAA Meet

Thank you for considering a contribution. The bar is high — we want this to become the canonical open-source meeting platform — but we also want to make contributing genuinely pleasant.

## How to help

### Report bugs

Open an issue at [github.com/hartemyaakoub/liqaa-meet/issues](https://github.com/hartemyaakoub/liqaa-meet/issues). Include:

- What you expected
- What happened
- Reproduction steps (or a minimal repro repo)
- Browser, OS, deployment mode (Docker / Vercel / dev)

### Propose a feature

For non-trivial features, **open an issue first**. Don't write the PR until we've agreed the design — it saves both of us time.

For trivial features (small UI tweaks, copy fixes, dependency bumps), just open a PR.

### Substantial changes

Any of:
- New API endpoint
- Breaking change to the SDK / database schema
- New dependency that adds > 100 KB to the bundle
- New external integration (LLM provider, SFU, storage)

…goes through the [LIQAA RFC process](https://github.com/hartemyaakoub/liqaa-rfcs).

## Development setup

```bash
git clone https://github.com/hartemyaakoub/liqaa-meet.git
cd liqaa-meet
cp .env.example .env.local
# fill in LIQAA_PK / LIQAA_SK from https://liqaa.io/console
npm install
npm run dev
```

The app runs on http://localhost:3000.

### Useful scripts

```bash
npm run dev         # next dev with HMR
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run format      # prettier across all files
```

## Code style

- **TypeScript strict** — all new code must type-check with `tsc --noEmit`.
- **No `any`** unless you justify it in a comment.
- **Server actions over client fetches** when possible (Next.js 16 App Router).
- **Inline styles are fine** for one-off UI; extract to `globals.css` only when reused.
- **No emojis in code** (you'll see them in copy and READMEs but never in identifiers).
- **Filenames**: kebab-case for routes (`r/[code]/`), PascalCase for components (`ComparisonTable.tsx`).
- **No dependencies that add > 50 KB to the production bundle** without an issue discussion first.

## Testing

We use Playwright for end-to-end tests and Vitest for unit tests. (Both will land in v0.4 — early contributors welcome to add the first ones.)

For now, manual testing is the bar:

1. Create a room
2. Join from two browser windows (incognito = second user)
3. Verify both see each other
4. Verify captions appear (Chromium only)
5. End the meeting
6. Verify the recap page renders the summary

## PR process

1. Fork → branch (`feat/`, `fix/`, `docs/` prefix)
2. Commit with [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `refactor:`)
3. Open the PR with a description that answers:
   - **Why** (link to the issue or RFC)
   - **What** (one paragraph)
   - **How to test** (steps)
4. Wait for CI to pass
5. A maintainer will review within ~3 business days

## Code of conduct

Be the kind of person you'd want as a colleague. We follow the [Contributor Covenant 2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

Harassment, discriminatory language, and personal attacks → immediate ban. We don't owe anyone access to this project.

## License

By contributing, you agree your code is licensed under [AGPL-3.0](./LICENSE).

If you'd like to be paid to contribute (sponsored work, custom features), email [partners@tkawen.com](mailto:partners@tkawen.com).

---

If this is your first PR ever — welcome. We'll be patient. Open the PR even if it's rough; we'll help you polish it.
