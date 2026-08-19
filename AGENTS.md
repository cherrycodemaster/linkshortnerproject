<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions

This is a link shortener built on Next.js 16 (App Router), Clerk auth, and a
Drizzle/Neon Postgres database. Detailed, topic-specific coding standards
live in [`.github/instructions`](./.github/instructions) and are applied
automatically based on each file's `applyTo` pattern.

General rules for all changes:

- Prefer editing/extending existing files over introducing new patterns;
  match the conventions already used in this repo.
- Never commit real secrets; `.env` values shown in this repo are examples
  only and must stay out of source control (already enforced by
  `.gitignore`'s `.env*` rule).
- Run `npm run lint` after non-trivial changes.
