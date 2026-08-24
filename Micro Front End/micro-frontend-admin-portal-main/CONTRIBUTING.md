# Contributing

Thanks for your interest! This is a learning / portfolio project demonstrating a
micro-frontend architecture with Next.js Multi-Zones. Contributions, issues, and
suggestions are welcome.

## Getting started

```bash
git clone https://github.com/muhammadafzal-dev/micro-frontend-admin-portal.git
cd micro-frontend-admin-portal
yarn install
yarn dev          # all 4 apps; open http://localhost:3000
```

Requirements: **Node ≥ 20**, **Yarn 1.x**.

## Project layout

- `apps/*` — the four independently deployable zones (`shell`, `auth`, `dashboard`, `settings`).
- `packages/*` — shared workspace packages (`types`, `config`, `ui`).

See the [README](./README.md) for the full architecture.

## Quality gates

Before opening a PR, make sure everything is green:

```bash
yarn lint         # ESLint (flat config)
yarn typecheck    # tsc --noEmit across all workspaces
yarn test         # Vitest
yarn build        # all four apps build
```

## Conventions

- **Branches:** `feat/<desc>`, `fix/<desc>`, `chore/<desc>`, `docs/<desc>`, `test/<desc>`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) —
  `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.
- **TypeScript:** strict mode, no `any`, named exports.
- **Keep zones independent:** shared code goes in `packages/*`; never import one app from another.
- **Auth is DEMO ONLY** — do not turn the mock cookie logic into real production auth.

## Pull requests

1. Fork and branch from `main`.
2. Keep PRs focused and small.
3. Ensure the four quality gates pass.
4. Describe the change and the reasoning.

## Reporting issues

Open a GitHub issue with steps to reproduce, expected vs actual behavior, and your
Node/OS versions.
