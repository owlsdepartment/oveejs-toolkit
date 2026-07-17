# ovee-docs MCP (internal)

Caches `owlsdepartment/ovee` branch `v3` under `.cache/ovee-mcp/src` and docs HTML under `.cache/ovee-mcp/docs`.

From repo root:

- `yarn mcp:build` / `pnpm mcp:build` — `npm install` in `scripts/mcp-ovee` and bundle `server.ts` -> `dist/server.js` (SDK + zod stay external next to that folder)
- `yarn mcp:dev` / `pnpm mcp:dev` — run `server.ts` directly with Node (same `npm install`)
- Cursor: enable server `ovee-docs` via `.cursor/mcp.json`

Tools: `ovee_get_file`, `ovee_list_dir`, `ovee_search`, `ovee_get_doc`, `ovee_refresh`.

Requires `git`, `rg` (ripgrep), and network for first clone / doc fetch.
