# Orgboard client

Minimal React + Tailwind app talking to the GraphQL API with typed operations (`graphql-codegen` client preset + `graphql-request`).

## Setup

```bash
# terminal 1 — API (from /server)
bun run db:seed   # once
bun run dev       # http://localhost:4000

# terminal 2 — client (from /client)
bun install
bun run codegen   # after schema or query changes
bun run dev
```

Seed login: `alice@tekvortex.dev` / `password`
