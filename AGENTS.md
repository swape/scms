# AGENTS.md — Development Guide

This file defines coding standards and workflow rules for this repository.

Current stack:

- Astro 7
- Svelte 5
- Tailwind CSS 4
- TypeScript strict mode

## Core Rules

- Keep TypeScript strict and avoid `any`.
- Define shared object shapes in `src/types/types.ts`.
- Prefer `interface` for object contracts and `type` for unions/aliases.
- Keep store-based app state in `src/store.ts`.
- Keep localStorage helper logic in `src/localstorage.ts`.
- Guard browser-only APIs in SSR contexts.

## Svelte Guidance

- Use Svelte 5 runes for new local component state.
- Keep existing store patterns consistent where already implemented.
- Keep components focused and move reusable logic into `.ts` helpers.
- Use one component per file and keep naming consistent with current folders.

## CSS And Tailwind

- Use Tailwind utilities first.
- Keep class names kebab-case.
- Do not use BEM naming.
- Use component `<style>` only when utilities are not enough.
- Do not use `!important` unless there is no safe alternative.

## Astro Guidance

- Treat files in `src/pages` as route definitions.
- Keep page files focused on composition and routing.
- Move interactive UI into Svelte components.
- Use client directives only when interactivity is needed.

## Current Project Structure

```text
.
├── AGENTS.md
├── README.md
├── agent-changes.md
├── astro.config.mjs
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── constants.ts
    ├── localstorage.ts
    ├── store.ts
    ├── components/
    │   ├── AuthGate.svelte
    │   ├── Login.svelte
    │   ├── editor/
    │   │   ├── EditorTopMenu.svelte
    │   │   ├── ElementsList.svelte
    │   │   ├── ListPages.svelte
    │   │   ├── ListPagesContent.svelte
    │   │   ├── PageElements.svelte
    │   │   ├── Settings.svelte
    │   │   ├── Sidebar.svelte
    │   │   └── elements/
    │   │       └── Page/
    │   │           └── index.svelte
    │   ├── project/
    │   │   ├── Colors.svelte
    │   │   ├── Edit.svelte
    │   │   └── index.svelte
    │   └── projects/
    │       ├── helper.ts
    │       └── index.svelte
    ├── layouts/
    │   └── FrontPageLayout.astro
    ├── pages/
    │   ├── dashboard.astro
    │   ├── editor.astro
    │   ├── index.astro
    │   ├── preview.astro
    │   └── project.astro
    ├── styles/
    │   ├── global.css
    │   └── preview.css
    ├── types/
    |    └── types.ts
    └── previewRender/
```

## Preview Render

- Keep preview rendering logic in `src/previewRender`.
- common.ts: shared helper functions for rendering.
- All editor elements should have a corresponding render function in `previewRender`.

## NPM Scripts

- `npm run dev` starts the Astro dev server.
- `npm run check` runs `astro check`.
- `npm run build` builds production output.
- `npm run preview` previews the build.
- `npm run format` runs Prettier for the repository.

## Commit Checklist

- Run `npm run check` after significant code changes.
- Run `npm run format` before committing.
- Avoid committing test-only placeholders or hardcoded tokens.
- Update `README.md` when behavior, setup, or usage changes.

## Change Log Rule

- Record each agent update in `agent-changes.md`.
- Use date and affected file name(s).
- Write entries in past tense and keep them concise.
