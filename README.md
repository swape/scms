# SCMS — CMS from Outer Space

A visual, component-based page builder CMS for building responsive websites — developed with Astro, Svelte 5, and Tailwind CSS 4.

## Stack

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Framework | [Astro 7](https://astro.build)            |
| UI        | [Svelte 5](https://svelte.dev)            |
| Styling   | [Tailwind CSS 4](https://tailwindcss.com) |
| Language  | TypeScript (strict)                       |
| Storage   | LocalStorage (current), backend pending   |

## Features

- **Visual Editor** — Drag-and-drop-style page builder with a sidebar of content elements.
- **Content Elements** — Text, Header, Image, Link, Split Block, and Page-level components.
- **Live Preview** — Real-time iframe-based preview synced with editor settings.
- **Project Management** — Create, edit, and configure multi-page projects.
- **Customizable Menus** — Hierarchical navigation menus with link, dropdown, and auto-generated (sub-page) items.
- **Customizable Footers** — Link, social, text, and custom HTML footer elements.
- **Color Theming** — Light/dark palette support per project, with per-page color overrides.
- **Page Builder** — Full control over page order, background, and text colors.
- **Settings Panels** — Block-owned content and style controls, including padding, margin, colors, and border radius.
- **Responsive Preview** — Mobile-first CSS with layout adjustments.

## Project Structure

```
src/
├── blocks/                # Colocated block editors, previews, and scoped CSS
│   ├── Header/
│   ├── Image/
│   ├── Link/
│   ├── Page/              # Page settings (not an insertable content block)
│   ├── SplitBlock/
│   ├── Text/
│   └── shared/            # Reusable style controls and helpers
├── components/
│   ├── editor/            # Visual editor UI
│   │   ├── ElementsList.svelte
│   │   ├── ListPages.svelte
│   │   ├── PageElements.svelte
│   │   ├── PreviewWrapper.svelte
│   │   ├── Settings.svelte
│   │   ├── Sidebar.svelte
│   │   └── elements-list.ts # Registry: editors, previews, defaults, CSS
│   ├── project/           # Project settings
│   │   ├── Colors.svelte
│   │   ├── Edit.svelte
│   │   ├── ProjectFooter.svelte
│   │   └── ProjectMenu.svelte
│   ├── projects/          # Project listing
│   │   └── index.svelte
│   ├── AuthGate.svelte
│   └── Login.svelte
├── pages/
│   ├── editor.astro       # Page editor route
│   ├── dashboard.astro    # Project dashboard
│   ├── project.astro      # Project settings route
│   └── preview/           # Preview rendering (Astro pages)
│       ├── index.astro
│       ├── ElementSelector.astro
│       └── Menu.astro
├── previewRender/         # Shared preview utilities (e.g. URL sanitization)
├── store.ts               # Central Svelte store (app state)
├── localstorage.ts        # LocalStorage persistence layer
├── types/types.ts         # TypeScript interfaces
├── utils/                 # Helpers (elements, menu, footer, projects)
└── styles/                # Global & preview CSS
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:4321)
npm run dev

# Type check
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Notes

- **State Management:** Single Svelte store (`src/store.ts`) holds all project and editor state.
- **Persistence:** Data is written to `localStorage` via `src/localstorage.ts`. A backend integration is planned.
- **Preview:** The editor sends page data and project settings to an Astro-powered preview page inside an iframe. The preview generates scoped CSS via `cssHelpers.ts`.
- **SSR Guarding:** Browser-only APIs (localStorage, DOM) are guarded so Astro SSR doesn't crash.

### Adding a Block

Each content block lives in `src/blocks/<Name>/`:

- `index.svelte` owns its editor fields and style controls. Its props follow `BlockEditorProps` from `src/types/types.ts`. Compose controls such as `Wrapper`, `Padding`, `Margin`, and `TextAndBackgroundColors` from `src/blocks/shared/` as needed.
- `Preview.astro` renders the saved content using the `BlockPreviewProps` contract. Keep the `data-id` section attribute for preview selection and the `scms_<id>` class for scoped CSS.
- An optional `css.ts` exports block-specific CSS rules; shared colors, padding, margins, and border radius are generated centrally.

Register the block once in `src/components/editor/elements-list.ts`:

```ts
{
  type: 'quote',
  name: 'Quote',
  icon: 'format_quote',
  editor: () => import('../../blocks/Quote/index.svelte'),
  preview: '/src/blocks/Quote/Preview.astro',
  defaults: () => ({ content: 'New quote' }),
}
```

The registry drives the add-block list, settings panel, creation defaults, preview selection, and optional block-specific CSS. No type switches need updating. Editors are loaded lazily so server-side preview rendering does not execute browser-only editor state. Astro previews are discovered only on the server, keeping them out of the client bundle.

`ElementDefinition` is defined alongside the shared types and re-exported by the registry. Its optional `defaults(firstPageId)` callback returns fresh initial content/settings; optional `css(item, selector)` returns `{ selector, declarations }` rules. For example, import a new block's `getCss` function and register it as `css: getCss` when it needs additional scoped styles.

Page settings use a separate `pageDefinition` in the same registry and retain page-level palette colors. Existing saved element type names and data shapes remain unchanged.

## Current Stack Details

- **Astro 7** — Route definitions live in `src/pages/`, interactive UI is delegated to Svelte components.
- **Svelte 5** — Uses Svelte 5 runes for local component state; store patterns follow Svelte 5 conventions.
- **Tailwind CSS 4** — Utility-first styling via the Vite plugin; component `<style>` tags used only when utilities are insufficient.
- **TypeScript** — Strict mode on; `interface` for object contracts, `type` for unions/aliases.

## Development Guide

See [AGENTS.md](./AGENTS.md) for coding standards, workflow rules, and commit checklist.

## Roadmap

See [plan.md](./plan.md) for the active backlog. Key planned items:

- [ ] Astro build server for static site generation (separate repo)
- [ ] Database integration (save/load projects)
- [ ] Drag-and-drop page reordering
- [ ] Project edit form validation

## License

ISC — © Alireza Balouch
