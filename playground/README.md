# Owls UI playground (demo app)

The playground is a **local demo** of toolkit + integrations + modules + tools. It is git-ignored by default; the canonical copy of the demo sources lives in `scripts/templates/playground/` (`_*` files). Run `pnpm playground reset` to replace local files with those templates.

From the monorepo root (with dependencies installed):

```bash
pnpm playground init   # create missing playground files from templates
pnpm playground reset  # delete then recreate playground files (destructive)
pnpm dev               # Vite dev server for the demo
```

Register or extend behavior in `playground/src/components.ts` and `playground/src/modules.ts`. The demo `index.html` uses `data-*` hooks expected by Ovee v3 (`data-base-accordion`, `data-nav-toggle`, etc.).
