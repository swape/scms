# AGENTS.md — Development Best Practices

This document defines coding standards and best practices for this project.
Stack: **Astro 5**, **Svelte 5**, **Tailwind CSS v4**, **TypeScript (strict)**.

---

## TypeScript

- Use `strict` mode (already enforced via `astro/tsconfigs/strict` in `tsconfig.json`).
- Never use `any`. Prefer `unknown` when the type is genuinely unknown, then narrow it.
- Define all data shapes as interfaces in `src/types/types.ts`. Do not scatter inline type definitions across files.
- Prefer `interface` over `type` for object shapes; use `type` for unions, intersections, and aliases.
- Always type function parameters and return values explicitly when the inference is non-obvious.
- Use index signatures (`[key: string]: ...`) only when the key set is truly dynamic; prefer mapped types or records otherwise.
- Never cast with `as` unless you have verified the shape (e.g. after a runtime guard or JSON parse).
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of loose `||` guards.

```ts
// Good
function getPage(id: string): PageType | null { ... }

// Avoid
function getPage(id: any) { ... }
```

---

## Svelte

This project uses **Svelte 5**. Prefer runes over the legacy options API.

### Reactivity

- Use `$state()` for local reactive state instead of `let` with implicit reactivity.
- Use `$derived()` for computed values instead of `$:` reactive statements.
- Use `$effect()` for side-effects (DOM manipulation, subscriptions) instead of `onMount` + `$:` combos.
- Use `$props()` to declare component props with full TypeScript types.

```svelte
<script lang="ts">
  let { label, onClick }: { label: string; onClick: () => void } = $props();
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    document.title = `Count: ${count}`;
  });
</script>
```

### Stores (legacy API — keep existing store usage consistent)

- Global shared state lives in `src/store.ts` using `writable` stores from `svelte/store`.
- Always type `Writable<T>` explicitly: `const foo: Writable<FooType | null> = writable(null)`.
- Subscribe side-effects (e.g. `localStorage` sync) belong in `src/store.ts`, not in components.
- In Svelte 5 components, access stores with the `$` prefix: `$currentProject`.

### Components

- One component per file; file name matches the exported component name (`PascalCase.svelte`).
- Keep components small and focused. Extract sub-components rather than growing a single file.
- Use `<slot />` (Svelte 4 style) or `{@render children()}` (Svelte 5 snippets) for composition — be consistent within a file.
- Do not place business logic inside `.svelte` files. Extract helpers to `.ts` files alongside the component.
- Avoid `window.*` calls at module level in `.svelte` files; guard them inside `$effect()` or `onMount` to prevent SSR breakage.

```svelte
<!-- Avoid: runs during SSR -->
<script>
  let scms = window.localStorage.getItem('scms')
</script>

<!-- Prefer: runs only in browser -->
<script>
  import { onMount } from 'svelte'
  let scms = $state<string | null>(null)
  onMount(() => { scms = window.localStorage.getItem('scms') })
</script>
```

---

## CSS / Tailwind CSS

This project uses **Tailwind CSS v4** (imported via `@import 'tailwindcss'` in `src/styles/global.css`).

### Utility classes

- Use Tailwind utility classes directly in templates for one-off styles.
- Extract repeated utility combinations into semantic class abstractions in `global.css` using `@apply` (e.g. `.btn`, `.forms`, `.tab`).
- Do not duplicate `.btn`, `.forms`, or other globals — extend the existing definitions.

### Scoped styles in Svelte

- Use `<style>` blocks in `.svelte` files for styles that are truly component-specific and cannot be expressed cleanly with utilities.
- Avoid global selectors inside scoped `<style>` blocks; use `:global()` only when targeting third-party or slotted content.

### CSS nesting

- Native CSS nesting is used in this project (e.g. `.btn { &.active { ... } }`). Keep this pattern consistent.
- Use `&` for modifier/state selectors; avoid deep nesting beyond two levels.

### Design tokens / colors

- Project colors are stored in `ProjectType.colors` as `{ [key]: { c: string; key: string } }`.
- Do not hard-code color hex values in templates. Reference color keys from the project store and apply them via inline styles or CSS custom properties where Tailwind utilities are insufficient.

### Do not

- Do not use `!important`.
- Do not write bare `<style>` with magic numbers for spacing or color — use Tailwind scale values.
- Do not mix Tailwind v3 (`@tailwind base`) syntax with v4 (`@import 'tailwindcss'`).

---

## Astro

### Pages

- Every file in `src/pages/` maps to a route. File names are `kebab-case.astro`.
- Pages should only handle routing, layout composition, and server-side data fetching. Move all interactive UI into Svelte components.
- Use layouts from `src/layouts/` for consistent page shells; do not repeat `<head>` boilerplate in pages.

### Component islands

- Add `client:load` only when the component needs reactivity immediately on page load.
- Prefer `client:idle` or `client:visible` for components below the fold to improve performance.
- Do not add client directives to purely static components.

```astro
<!-- Needs interactivity on load -->
<Login client:load />

<!-- Below the fold, can defer -->
<HeavyWidget client:visible />
```

### Frontmatter

- Keep the frontmatter (`---`) section focused on imports and server-side logic.
- Type all variables derived from `Astro.props` or `Astro.params`.
- Avoid complex business logic in frontmatter — delegate to helper functions in `.ts` files.

### Imports

- Import order is enforced by `@ianvs/prettier-plugin-sort-imports`. Run `npm run format` before committing.
- Use path aliases if configured; otherwise use relative imports (`../`).
- Always import types with `import type { ... }` to avoid runtime overhead.

---

## File & Folder Conventions

```
src/
  components/       # Svelte components, grouped by feature
  layouts/          # Astro layout components
  pages/            # Astro file-based routes
  styles/           # Global CSS (global.css, preview.css)
  types/            # Shared TypeScript interfaces (types.ts)
  store.ts          # Global Svelte stores
  localstorage.ts   # localStorage helpers
```

- Group related components in a subdirectory (e.g. `components/editor/`, `components/project/`).
- Place helper/utility functions in a `helper.ts` file co-located with the feature folder.
- Do not import from `dist/` or `.astro/` directories.

---

## General

- Run `npm run check` (`astro check`) before committing to catch type and template errors.
- Run `npm run format` (`prettier`) to auto-format all files.
- Never commit hardcoded credentials, tokens, or UIDs (see `Login.svelte` — replace mock auth before production).
- Keep `localStorage` access centralized in `src/localstorage.ts`; do not call `window.localStorage` directly in components.
- Add summary of changes in `agent-changes.md` file. Keep it short and concise, focusing on the key updates and their impact on the project. This will help maintain a clear history of modifications for future reference. Add date and file name to the summary for better organization and tracking.
- Write any changes to agents-changes.md in the past tense, as they describe completed actions. This helps maintain a clear and consistent narrative of the project's evolution. For example, instead of saying "Fixes memory leaks by replacing .subscribe() with $effect()", write "Fixed memory leaks by replacing .subscribe() with $effect()". This approach provides a clear record of what was done and when, making it easier for future developers to understand the history of changes.
- Update Readme.md file if there is any changes that need to be changed.
