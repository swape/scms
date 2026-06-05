## 2026-06-05 — Improvement Plan Implementation

### Files created

- `src/components/editor/blocks/block-text/definition.ts` — Block default data (was inlined in `constants.ts`)
- `src/components/editor/blocks/block-text/Settings.svelte` — Moved from `elementSettings/BlockText.svelte`
- `src/components/editor/blocks/block-text/View.svelte` — Moved from `elementView/BlockTextView.svelte`
- `src/components/editor/blocks/block-button/definition.ts`, `Settings.svelte`, `View.svelte` — Same pattern
- `src/components/editor/blocks/block-divider/definition.ts`, `Settings.svelte`, `View.svelte` — Same pattern
- `src/components/editor/blocks/block-link/definition.ts`, `Settings.svelte`, `View.svelte` — Same pattern
- `src/components/editor/blocks/registry.ts` — Central block registry (`blockRegistry`, `getBlockByType`)
- `src/styles/blocks.css` — Semantic CSS class definitions for all block style options

### Files modified

- `src/constants.ts` — Replaced raw Tailwind class values in all option arrays with semantic class names (e.g. `pt-8` → `block-spacing-top-md`); removed exported block data objects
- `src/components/editor/elementBase.ts` — Rewired to use registry instead of hard-coded if/else
- `src/components/editor/elementView/index.svelte` — Replaced hard-coded block conditionals with `<svelte:component>` dispatch via registry
- `src/components/editor/ElementSettings.svelte` — Replaced hard-coded block settings conditionals with registry lookup
- `src/components/editorParts/NewBlockButtons.svelte` — Replaced hard-coded block list with `{#each blockRegistry}` loop
- `src/styles/global.css` — Added `@import './blocks.css'`

### Files deleted

- `src/components/editor/elementSettings/BlockText.svelte`
- `src/components/editor/elementSettings/BlockButton.svelte`
- `src/components/editor/elementSettings/BlockDivider.svelte`
- `src/components/editor/elementSettings/BlockLink.svelte`
- `src/components/editor/elementView/BlockTextView.svelte`
- `src/components/editor/elementView/BlockButtonView.svelte`
- `src/components/editor/elementView/BlockDividerView.svelte`
- `src/components/editor/elementView/BlockLinkView.svelte`

### Impact

- Adding a new block now requires only: one `blocks/<name>/` folder + one entry in `registry.ts`
- All block option values are now decoupled from Tailwind; styles live in `src/styles/blocks.css`
- Zero `astro check` errors after changes

---

## 2026-06-05 — Split Block

### Files created

- `src/components/editor/blocks/block-split/definition.ts` — Default data for split block with `settings.columns` (1–3)
- `src/components/editor/blocks/block-split/Settings.svelte` — Column count selector and per-column "add block" buttons (excludes `block-split` to prevent nesting)
- `src/components/editor/blocks/block-split/View.svelte` — Renders N-column CSS grid; child blocks stored with `parent = splitBlock.id` and `columnIndex`

### Files modified

- `src/components/editor/blocks/registry.ts` — Registered `block-split` block
- `src/styles/blocks.css` — Added `.split-block-grid` and `.split-block-column` with `@media (max-width: 640px)` breakpoint to collapse to single column on mobile
