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
- **Content Blocks** — Text, Header, Image, Link, and Split Block, plus separate page-level settings.
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
│   │   ├── index.svelte  # Editor fields and style controls
│   │   ├── Preview.astro # Server-rendered block markup
│   │   └── css.ts        # Block-specific scoped CSS rules
│   ├── Image/
│   ├── Link/
│   ├── Page/
│   │   └── index.svelte  # Page settings (not an insertable content block)
│   ├── SplitBlock/
│   ├── Text/
│   └── shared/
│       ├── ColorSelect.svelte
│       ├── Margin.svelte
│       ├── Padding.svelte
│       ├── Styles.svelte  # Configurable block style sections
│       ├── TextAlign.svelte
│       ├── TextAndBackgroundColors.svelte
│       ├── Wrapper.svelte
│       ├── css.ts        # CSS value validation and formatting
│       └── defaults.ts   # Shared link defaults
├── components/
│   ├── Checkbox.svelte     # Shared accessible toggle switch
│   ├── Input.svelte        # Shared labeled text, URL, number, and color field
│   ├── Select.svelte       # Shared native single-select control
│   ├── FileSelector/
│   │   └── index.svelte
│   ├── editor/            # Visual editor UI
│   │   ├── EditorTopMenu.svelte
│   │   ├── ElementsList.svelte
│   │   ├── ListPages.svelte
│   │   ├── ListPagesContent.svelte
│   │   ├── PageElements.svelte
│   │   ├── PreviewWrapper.svelte
│   │   ├── Settings.svelte
│   │   ├── Sidebar.svelte
│   │   └── elements-list.ts # Registry: editors, previews, defaults, CSS
│   ├── project/           # Project settings
│   │   ├── Colors.svelte
│   │   ├── Edit.svelte
│   │   ├── ProjectFooter.svelte
│   │   ├── ProjectMenu.svelte
│   │   └── index.svelte
│   ├── projects/          # Project listing
│   │   └── index.svelte
│   ├── AuthGate.svelte
│   └── Login.svelte
├── layouts/
│   └── FrontPageLayout.astro
├── pages/
│   ├── 404.astro
│   ├── index.astro        # Home route
│   ├── editor.astro       # Page editor route
│   ├── dashboard.astro    # Project dashboard
│   ├── project.astro      # Project settings route
│   └── preview/           # Preview route and composition helpers
│       ├── index.astro
│       ├── ElementSelector.astro
│       ├── Footer.astro
│       ├── Menu.astro
│       ├── MenuItem.astro
│       ├── MenuItems.astro
│       └── cssHelpers.ts
├── previewRender/
│   └── common.ts          # Shared preview utilities (e.g. URL sanitization)
├── constants.ts
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
- **Editor/Preview Separation:** Block editors are imported lazily. Server-side preview code uses block markup and CSS helpers without executing browser-only editor stores.

## Adding a New Block

The single registration point is [elements-list.ts](./src/components/editor/elements-list.ts). Adding a content block does not require changing the settings panel, creation helpers, or preview selector.

### 1. Create the block directory

For example, add a `Quote` block:

```text
src/blocks/Quote/
├── index.svelte
├── Preview.astro
└── css.ts          # Optional: block-specific generated CSS
```

Keep the exact `Preview.astro` filename directly inside the block directory: the preview selector discovers `/src/blocks/*/Preview.astro`. Page settings are the exception; `Page/index.svelte` is registered separately through `pageDefinition` and is not an insertable block.

### 2. Add the Svelte editor

Create `src/blocks/Quote/index.svelte`:

```svelte
<script lang="ts">
  import { selectedElement } from '../../store.ts';
  import type { BlockEditorProps } from '../../types/types.ts';
  import Styles from '../shared/Styles.svelte';

  const { update, updatePageContentWithDebounce }: BlockEditorProps = $props();
  const quote = $derived(
    $selectedElement && 'content' in $selectedElement
      ? ($selectedElement.content ?? '')
      : ''
  );

  function updateContent(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    update('content', input.value);
  }
</script>

<div class="input-and-label-wrapper">
  <label for="quote-content">Quote:</label>
  <textarea id="quote-content" value={quote} oninput={updateContent}></textarea>
</div>

<Styles {update} {updatePageContentWithDebounce} />
```

Each block chooses the style controls it exposes using [Styles.svelte](./src/blocks/shared/Styles.svelte). It includes the Styles heading and defaults to `sections={['wrapper', 'colors', 'padding', 'margin']}`. Pass a subset in the desired order, such as `sections={['colors', 'padding']}`, to select which controls appear; an empty list hides the entire section. Set `allowCenter` to enable the wrapper's Center option. To insert block-specific fields, include `'custom'` at the desired position and pass those fields as child content, as in the Split Block editor. Individual controls remain available in [blocks/shared](./src/blocks/shared).

For boolean settings, use [Checkbox.svelte](./src/components/Checkbox.svelte) with `id`, `label`, `checked`, and `oninput` props. It displays a toggle switch with an animated thumb, a clickable label, keyboard focus feedback, and optional `disabled` support. A native checkbox with `role="switch"` preserves keyboard interaction and exposes its state to assistive technology; animations respect reduced-motion preferences.

For dropdowns, use [Select.svelte](./src/components/Select.svelte). It owns the `input-and-label-wrapper` div and associated label, wraps a native single-select, accepts native attributes and `oninput`/`onchange` handlers, and supports typed `bind:value`. Provide a `label`; `id` is optional and defaults to a unique generated ID. Pass options as child content so dynamic lists and conditional options remain local to the caller. Styling continues to use the shared native-select rules. Project panels can set `wrapperClass` for their field layout and `hint` for helper text beneath the select.

For input fields, use [Input.svelte](./src/components/Input.svelte). It owns the same wrapper and associated label, generates an ID when omitted, and forwards native attributes and events. It defaults to `type="text"` and also supports URL, number, color, email, password, search, and telephone fields. Use `bind:value` when needed; number inputs retain native Svelte numeric binding (including `undefined` when cleared). Use `wrapperClass` to preserve grouped or project-specific layouts and `hint` for helper text. Keep hidden transport fields native, use `Checkbox.svelte` for boolean switches, and leave multiline content in textareas.

```svelte
<Input
  id="link-url"
  label="URL:"
  type="url"
  value={url}
  placeholder="https://example.com"
  oninput={updateUrl} />
```

```svelte
<Select
  id="destination"
  label="Destination:"
  value={destination}
  onchange={updateDestination}>
  <option value="url">URL</option>
  <option value="page">Page</option>
</Select>
```

Import it from `../../components/Select.svelte` in block editors. In project components, use `../Select.svelte`; existing bound settings can use `<Select label="Setting" bind:value={setting}>...</Select>`. Do not add another field wrapper or label around the component.

`update(key, value)` updates the selected element and schedules persistence to the current page/project. If a control modifies a store directly instead, call `updatePageContentWithDebounce()` afterward. Keep new local state in Svelte 5 runes and define any new saved object fields in [types.ts](./src/types/types.ts).

### 3. Add the Astro preview

Create `src/blocks/Quote/Preview.astro`:

```astro
---
import type { BlockPreviewProps } from '../../types/types.ts';

interface Props extends BlockPreviewProps {}

const { data } = Astro.props;
const wrapper = String(data.style?.wrapper || '');
---

<section
  data-id={String(data.id)}
  class={`${wrapper} scms_${String(data.id)}`.trim()}>
  <blockquote>{data.content}</blockquote>
</section>
```

The section's `data-id` enables selection from the preview. The `scms_<id>` class connects the block to generated scoped CSS, and the wrapper class honors its editor setting. Render content using escaped expressions; use the existing `sanitizeHref` helper from [common.ts](./src/previewRender/common.ts) for block links or image URLs. Keep browser-only editor state out of Astro preview imports.

### 4. Register the block

Add this entry to `elementsList` in [elements-list.ts](./src/components/editor/elements-list.ts):

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

The `type` must be unique and stable because it is saved in page content. `name` is the initial title shown in the editor, and `icon` is a Material Symbols icon name.

The optional `defaults(firstPageId)` callback returns fresh initial content/settings for each new instance. Creation supplies the ID, order, parent, page ID, title, and type, along with the default container wrapper and bottom margin. Avoid reusing mutable objects between instances.

`ElementDefinition` lives in [types.ts](./src/types/types.ts) and is re-exported by the registry. Editors load lazily, while Astro previews are discovered on the server and kept out of the client bundle.

### 5. Add optional block-specific CSS

Shared colors, padding, margins, and border radius are generated by [cssHelpers.ts](./src/pages/preview/cssHelpers.ts). For additional scoped rules, create `src/blocks/Quote/css.ts`:

```ts
import type { BlockCssRule, ContentType } from '../../types/types.ts';
import { getTextAlign } from '../shared/css.ts';

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  return [
    {
      selector: `${selector} blockquote`,
      declarations: [
        'font-style: italic;',
        getTextAlign(item.style?.textAlign),
      ],
    },
  ];
}
```

Import `getCss` as `quoteCss` in the registry and add `css: quoteCss` to the Quote entry. Use the validation helpers in [shared/css.ts](./src/blocks/shared/css.ts) for saved color, length, and alignment values. If you expose text alignment in the editor, compose the shared `TextAlign` control with `styleName="textAlign"`.

### 6. Verify the block

Run `npm run check`, then open a project in the editor and verify:

- The block appears in the add-element list with the correct name and icon.
- Adding multiple instances gives each its own content and settings.
- Content and style edits persist in the current page/project and update the iframe.
- Clicking the rendered section selects the correct block.
- The preview works at desktop and mobile widths, including light/dark palette colors.

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
