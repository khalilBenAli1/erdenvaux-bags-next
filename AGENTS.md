# ErdenVaux

Original fictional luxury bags portfolio application, created November 2026. Keep sample commerce explicit; no real purchase, payment details or external messages.

- Node 22.23.1; npm 10.9.8; project-local peer resolution is explicit. Run `npm ci` inside this independent repository.
- `npm run dev` / `npm run preview` use port 4202. `npm run build` exports static `out/` for `/erdenvaux-bags-next/`.
- Verify `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`.
- Pages compose focused features. Pricing, validation, state transitions and stored-data validation stay pure; storage access stays in its adapter.
- Create Zustand state through a per-provider factory, never mutable customer state at module scope. Contact and confirmation data remain in feature memory.
- Media ownership: `/root/maison_assets` owns only `public/images/**`, `docs/IMAGE_PROVENANCE.md`, `docs/image-prompts.json` until its handoff. Do not edit those files or change matching product geometry/material/color/filename without coordination.
- Reflow assertions compare `documentElement.scrollWidth` with `documentElement.clientWidth`. Test actual touch-mobile, long content and increased critical text; never hide overflow.
- Test rapid URL changes and delayed native dialog-close events; close intent must be explicit.
- Preserve other repositories and user edits. Use verified, coherent Lore commits and normal history-preserving PR merges after passing CI.
