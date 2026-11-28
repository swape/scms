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

- **Visual Editor** — Add, edit, delete, and drag to reorder content blocks, with a live iframe preview.
- **Content Blocks** — Hero, Card Grid, Call to Action, Video, Text, Header, Image, Link, Split Block, and FAQ, plus separate page-level settings.
- **Project Management** — Create and edit projects with nested pages, project settings, and project color palettes.
- **Customizable Menus** — Project-global navigation with links, manual dropdowns, and automatically generated sub-page items; edit and reorder items from the preview. Menu settings use labeled Material Symbols arrow and delete buttons for moving and removing items.
- **Customizable Footers** — Project-global link, social, text, and custom HTML elements; add, edit, remove, and reorder them from the preview. Footer settings match the menu's item cards and accessible Material Symbols arrow and delete controls.
- **Color Theming** — Project palettes grouped into Background and Text colors, with editable labels, paired light/dark values, and support for adding more pairs; per-page color overrides are supported.
- **Page Settings** — Edit page titles, numeric order, and palette-based background and text colors.
- **Settings Panels** — Block-owned content and style controls, including padding, margin, colors, and border radius; Split Block also supports a configurable image minimum height. Use **Float settings panel** to open a floating overlay and expand the preview into the freed sidebar space; **Pin settings panel to side** restores the right-hand column without resetting your edits. The pin control stays available while scrolling or when nothing is selected.
  Drag the floating panel's top bar horizontally or vertically; the pin button and form fields remain independent. Floating mode uses a compact, scrollable height so downward movement is not blocked by a full-height panel. Movement stays within the viewport, including after resizing the window. Focus the header and use arrow keys to move by 10px, or Shift+arrow keys for 50px. Pinning clears the custom position.
- **Responsive Preview** — Preview generated pages with responsive layouts and project-wide menu and footer.
- **JSON Backups** — Download the entire current project and restore it from a validated JSON file, including the latest pending edits.

## Project Structure

Application source:

```
src/
├── blocks/                # Colocated block editors, previews, and scoped CSS
│   ├── Header/
│   │   ├── index.svelte  # Editor fields and style controls
│   │   ├── Preview.astro # Server-rendered block markup
│   │   └── css.ts        # Block-specific scoped CSS rules
│   ├── Image/
│   │   ├── index.svelte
│   │   ├── Preview.astro
│   │   ├── css.ts
│   │   └── figureStyles.css
│   ├── Link/
│   │   ├── index.svelte
│   │   ├── Preview.astro
│   │   ├── css.ts
│   │   └── linkStyles.css
│   ├── Page/              # Page settings (not an insertable content block)
│   │   └── index.svelte
│   ├── Footer/            # Project-global footer editor and preview
│   │   ├── index.svelte   # Project-global footer settings editor
│   │   ├── Footer.astro
│   │   └── footerStyles.css
│   ├── Menu/              # Project-global menu editor and preview
│   │   ├── index.svelte   # Project-global menu settings editor
│   │   ├── Menu.astro
│   │   ├── MenuItems.astro
│   │   └── menuStyles.css
│   ├── SplitBlock/
│   │   ├── index.svelte
│   │   ├── Preview.astro
│   │   ├── css.ts
│   │   └── splitBlockStyles.css
│   ├── Text/
│   │   ├── index.svelte
│   │   ├── Preview.astro
│   │   └── css.ts
│   └── shared/
│       ├── ColorSelect.svelte
│       ├── Margin.svelte
│       ├── Padding.svelte
│       ├── Styles.svelte  # Configurable block style sections
│       ├── TextAlign.svelte
│       ├── TextAndBackgroundColors.svelte
│       ├── Wrapper.svelte
│       ├── css.ts        # CSS value validation and formatting
│       └── helpers.ts    # Shared editor, preview, and link helpers
├── components/
│   ├── Button.svelte       # Shared button variants, icons, native events and DOM ref
│   ├── Icon.svelte         # Decorative Material Symbols icon
│   ├── Field.svelte        # Shared field label, hint, and control styling
│   ├── Textarea.svelte     # Shared labeled multiline field
│   ├── PanelSection.svelte # Properties section heading, actions, and divider
│   ├── Checkbox.svelte     # Shared accessible toggle switch
│   ├── Input.svelte        # Shared labeled text, URL, number, and color field
│   ├── SizeInput.svelte    # Shared numeric size with px/rem/ch selector
│   ├── Select.svelte       # Shared native single-select control
│   ├── Tabs.svelte         # Reusable keyboard-accessible tab navigation
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
│   │   ├── ColorPair.svelte # Reusable labeled light/dark palette card
│   │   ├── Edit.svelte
│   │   └── index.svelte
│   ├── projects/          # Project listing
│   │   └── index.svelte
│   ├── AuthGate.svelte
│   └── Login.svelte
├── layouts/
│   └── FrontPageLayout.astro
├── pages/                 # Astro routes and preview composition helpers
│   ├── 404.astro          # /404 and unmatched routes
│   ├── index.astro        # / — Home
│   ├── editor.astro       # /editor?p=<id>[&local=true] — Visual page editor
│   ├── dashboard.astro    # /dashboard — Project listing
│   ├── project.astro      # /project?p=<id> — Project settings
│   └── preview/           # Preview route and composition helpers
│       ├── index.astro    # /preview/ — GET/POST page and project rendering
│       ├── ElementSelector.astro # Registry-driven content block rendering
│       └── cssHelpers.ts  # Generated block styles and palette variables
├── constants.ts
├── store.ts               # Central Svelte store (app state)
├── localstorage.ts        # LocalStorage persistence layer
├── types/
│   └── types.ts           # Shared TypeScript interfaces
├── styles/
│   ├── global.css         # Application styles
│   └── preview.css        # Preview layout and selection styles
└── utils/
    ├── editor-save.ts     # Debounced editor saves and synchronous export/import flush
    ├── elements.ts        # Content-block creation and updates
    ├── footer.ts          # Footer settings helpers
    ├── menu.ts            # Menu settings helpers
    ├── project-json.ts    # Project JSON validation before import
    └── projects.ts        # Project defaults and local retrieval
```

Browser tests and automation:

```text
.github/
└── workflows/
    └── playwright.yml     # CI type checks, browser tests, and HTML report upload
tests/
└── e2e/
    ├── fixtures.ts        # Isolated browser state, project data, and preview helpers
    ├── pages.spec.ts      # Routes, authentication, project settings, and previews
    ├── blocks.spec.ts     # Content block insertion, editing, styling, and deletion
    ├── editor.spec.ts     # Page management, reordering, persistence, dark mode, and JSON backups
    └── global-blocks.spec.ts # Project-global Menu and Footer editors
playwright.config.ts       # Chromium project and dedicated Astro test server
.prettierignore            # Excluded generated test reports and results
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

## Browser Tests

Playwright runs Chromium end-to-end tests against a dedicated Astro development
server at `http://127.0.0.1:4322`. The test runner starts and stops this server
automatically; it can run alongside the normal development server on port 4321.

```bash
# Install the test browser after npm install (or npm ci)
npx playwright install chromium

# Run the full browser suite
npm test

# Run one suite or a matching test
npm test -- tests/e2e/blocks.spec.ts
npm test -- --grep "Split Block"

# Open the interactive test runner
npm run test:ui

# View the latest HTML report
npm run test:report
```

The suites in [tests/e2e](./tests/e2e) cover:

- Home, dashboard, project settings, editor, preview, and 404 routes, including
  demo sign-in/sign-out, protected content, and missing-data states.
- Text, Header, Image, Link, and Split Block insertion, editing, shared styles,
  preview rendering, deletion, and reload persistence.
- Page settings, page/subpage creation and deletion, content drag-and-drop,
  palette changes, and dark mode.
- Project-global Menu and Footer editing, item types, ordering, removal, and
  persistence across pages.
- GET previews, the editor's POST-based iframe preview (including large payloads),
  and mobile Split Block layout.
- JSON backup roundtrips with pending edits, same-ID restoration, invalid/cyclic
  project rejection, and canceled imports followed by retry.

Each test uses an isolated browser context and deterministic local project data.
External fonts and placeholder images are intercepted, so tests do not depend on
those services. Uncaught browser errors fail tests. Screenshots and traces are
retained for failures in `test-results/`; the HTML report is in
`playwright-report/`. Both directories are ignored by Git.

The [Playwright workflow](./.github/workflows/playwright.yml) installs Chromium
with its Linux system dependencies, runs type checks and the browser suite on
pull requests and pushes to `main`, and uploads the HTML report. The editor's
existing Save to server/Save and Publish actions remain placeholders; JSON backups work independently.

## Architecture Notes

- **State Management:** Single Svelte store (`src/store.ts`) holds all project and editor state.
- **Persistence:** Data is written to `localStorage` via `src/localstorage.ts`. A backend integration is planned.
- **Preview:** The editor sends page data and project settings to an Astro-powered preview page inside an iframe. The preview generates scoped CSS via `cssHelpers.ts`.
- **Editor/Preview Separation:** Block editors are imported lazily. Server-side preview code uses block markup and CSS helpers without executing browser-only editor stores.
- **Pending Edits:** Block, page, and footer editors keep their existing debounce delays. JSON export/import synchronously flushes queued edits through `src/utils/editor-save.ts` before reading or replacing the draft.

## Editor Interface and Shared Controls

The sidebar and settings inspector follow [Figma's own editor interface](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar): neutral charcoal panels, compact 2rem controls, section dividers, blue selected rows, and small icon actions. The sidebar groups Pages, Add element, and Layers; the inspector shows the selected object's properties. Narrow windows stack the panels instead of squeezing the preview. **Toggle dark mode** controls the rendered page, not the editor chrome.

Settings are grouped into **Content**, **Style**, and **Other settings** tabs. Content contains text, images, links, and item lists. Style contains alignment, colors, layout, and size controls. Other settings contains behavior such as link targets, sticky navigation, FAQ opening rules, and page order, plus read-only element details. A new selection starts on Content. Tabs stay available in the pinned or floating header; switching tabs keeps controls mounted so drafts and pending unit selections survive. Use Left/Right arrows or Home/End while a tab is focused.

Inside **Style**, choose **Normal** or **Mobile overrides**. Normal is the base appearance; Mobile overrides stores only fields you change and inherits the rest. Mobile rules apply at preview viewport widths **768px and below**, including a small iPad in portrait; 769px and above uses Normal styles. This uses the iframe's actual width, not the outer editor window or the selected editing mode. Selecting Mobile overrides does not force the preview to a different size.

Beside **Toggle dark mode**, the preview size button cycles through **Desktop** (default, fills the available preview area), **Tablet** (up to 768px), and **Phone** (up to 390px). The iframe resizes without reloading and fits within the available space.

Use **Reset mobile overrides** to restore inheritance for the selected block, page, or global element. Clearing a mobile size field restores that field's normal value. Zero, false, and explicit None selections are retained as overrides. Styles support the existing appearance controls, including wrappers, alignment, colors, spacing, link-button presentation, Split Block flipping, page palettes, and menu layout/palettes. Content and Other settings remain shared across sizes. The footer currently has only one appearance, so its only style choice looks the same in both modes.

Overrides are saved in an optional sparse `mobileStyle` object on the block/page/menu/footer and included in JSON backups. Normal changes continue to affect inherited mobile properties. New selections start in Normal mode; mode changes preserve content edits. `MOBILE_STYLE_MAX_WIDTH` in `src/constants.ts` defines the shared breakpoint.

Home and Dashboard use the same charcoal application shell, typography, rounded surfaces, and blue accents. Main navigation highlights the current page. Sign-in/out, New project, and project cards reuse `Button` and `Icon`; the project grid stacks on narrow screens. The shared 2.75rem navigation bar also preserves the editor's viewport sizing. Authentication and project-creation behavior are unchanged.

All visible sidebar, inspector, block-settings, file-picker, and toolbar buttons use `Button.svelte`; fields use `Input`, `Select`, `Checkbox`, or `Textarea`. Hidden JSON file and preview transport inputs remain native. Design tokens (`--ui-*`) live in `src/styles/global.css`; controls have fallback tokens for reuse elsewhere.

- `Button`: `variant="ghost|secondary|primary|danger"`, `size="sm|md"`, `icon`, `iconPosition`, `iconOnly`, `active`, and `fullWidth`. Native events, ARIA, disabled state, and popover attributes forward to the real button. Use `bind:ref` for native focus or popover operations. Icon-only actions require an accessible label and should provide a tooltip.
- `Icon`: a decorative Material Symbol with `name` and optional numeric `size` in rem (default `1`).
- `Field`: the reusable `ui-field` wrapper, label, and hint used by text, numeric, select, and multiline controls. Existing `wrapperClass` hooks are retained; native controls use `ui-control`.
- `Textarea`: `label`, optional `id`, `value`/`bind:value`, `rows`, `hint`, and native textarea attributes/events. It supports vertical resizing, a visible neutral border at rest, and the shared blue focus highlight. Project descriptions and extra markup/style fields use this component too.
- `PanelSection`: a `title`, optional `actions` snippet, and child content for compact property groups with dividers.
- `Tabs`: typed options, selected value, and `onvaluechange`, with tab roles, selected states, roving focus, and arrow/Home/End navigation. Its `id` connects tab IDs to the caller's labeled panel.

Floating settings retain header dragging in both axes, keyboard movement, viewport containment, and a shorter scrollable body. Switching between floating and pinned modes preserves edits.

## Spacing and Size Units

Blocks with **Margin Block** (top and bottom) also have **Margin Inline** (start and end: left and right in left-to-right text). Each side can be set independently in **Normal** and **Mobile overrides**. Choose **Auto** on either side to use the available space, or on both sides to center a block that is narrower than its container.

Every existing size input in Settings uses a number field with its own **px**, **rem**, or **ch** selector. Padding, margins, border radii, and Split Block dimensions default to px; rendered blocks also use px for fixed spacing, gaps, and width defaults. Font styling remains rem-based. Existing explicit units are preserved when reopening a draft or importing JSON, rather than reset to the default. Editor interface styling remains rem-based.

Changing a unit keeps the entered number and applies the new CSS unit: `2px` becomes `2rem` when rem is selected. `rem` follows the page root text size; `ch` follows the width of the font's zero glyph. Fractional values and zero are supported; margins can be negative. Clearing a field removes its saved override. Selecting a unit on an empty field does not add an override, and unsaved unit selections reset when switching blocks. Numeric page order and menu item counts remain unitless.

Use `SizeInput` for size settings: pass `value`, `onvaluechange`, optional `fallback`, and `defaultUnit` (px by default; use `defaultUnit="rem"` for font-size controls). It composes the shared Input/Select controls. Read effective style values through `getStyleEditor().read(key)` and write a single field through `.set(key, value)`; undefined clears the current-mode override. `parseCssLength` parses values and `getCssLength` emits safe CSS. Bare legacy length values default to px; explicit px/rem/ch and existing em/% values keep their units. Responsive percentages, viewport sizing, image intrinsic dimensions, SVG coordinates, and user-authored CSS/HTML retain their meaning. Floating-panel browser coordinates are still handled independently from content size settings.

## Project Fonts

Under **Project → Settings → Fonts**, choose one font for **Headings and titles** and another for **Body text**. Both lists offer ten serif and ten sans-serif families ranked by popularity in [Google Fonts metadata](https://fonts.google.com/metadata/fonts), limited to families with Latin support. No monospace fonts are included.

Selections write only to **Extra head tags** and **Extra styles**. Keep manual edits outside the marked font blocks; **Use existing styles** removes the generated rule for that role. The editor interface does not change, and the font settings are included in project JSON through the existing extra fields.

## Project Color Palette

Open a project's **Colors** tab to edit **Background colors** and **Text colors**. Each card groups an editable **Label** with light-mode and dark-mode swatches and value fields. Labels appear in editor palette selectors; changing a label never changes the stable color key used by existing blocks, pages, and menus.

Use **Add color pair** in either group to create another light/dark pair. New entries receive unused `bg_` or `text_` keys and focus their label for naming. Both groups work with an empty palette; imported entries with other key prefixes remain editable under **Other colors**. Values and labels are included in project JSON backups.

Palette edits save to the current local draft, and the project page restores a matching draft on reload without discarding its page content. Open **Editor (continue last unsaved)** from the project summary to use that saved palette in the editor; the separate fresh-editor route retains its existing default-project behavior.

## Menu Appearance

Select the menu in the preview to open its settings. Under **Style → Appearance**, choose the layout and select **Background color** and **Text color** from the project's named palette. The menu and its dropdowns use those palette entries in both light and dark themes. **None** uses the primary project colors; older drafts with literal hex menu colors also fall back to primary colors until you choose palette entries.

The menu's **Label** field controls the displayed text of links and submenu headings. Label edits update the preview without changing destinations or opening targets, including nested links and items converted to links.

Enable **Other settings → Sticky menu** to keep navigation at the top while the page scrolls. It is off by default, works with horizontal and vertical layouts, and stays above page content without removing the menu's initial space. In the editor, it sticks to the top of the preview iframe. Menu appearance settings are project-global and included in JSON backups.

## Image Sources

Every image field in Image, Split Block, Hero, Card Grid cards, and Video posters offers **Select file** and a **Custom image URL** (or **Custom poster image URL**) input. Both edit the same source and update immediately. Each card has an independent picker, including after reordering. A custom URL clears obsolete library ID/type metadata where those fields are stored. The shared file selector still uses the project's existing example-file catalog; this does not add uploads or a production media library.

## Hero Block

Choose **Hero** under **Add element** to add an introduction with a heading, multiline description, optional background image, and button. Select an image from the file picker or enter its URL; **Remove image** also removes its dark overlay. Background images are decorative, so important information belongs in the heading or description. Clear **Button text** to hide the button; its destination can be a URL or project page.

Under **Style**, set alignment, minimum height, content width, heading size, image overlay percentage, project palette colors, border radius, padding, and margins. Size controls support px/rem/ch; heading sizes default to rem. Normal and Mobile overrides share the existing 768px breakpoint. Choose readable text colors for your background image. **Other settings** contains the heading level and button target. Hero content and styles persist in drafts and JSON backups.

## Card Grid, Call to Action, and Video

Choose these blocks under **Add element**. Each uses the shared **Content**, **Style**, and **Other settings** tabs, project palette selectors, spacing and border radius controls, normal/mobile styles, and JSON backups.

- **Card Grid:** starts with three cards. Edit titles, multiline descriptions, optional image URLs and image descriptions, and optional URL/page links. Add, reorder, and remove cards using the Material Symbols buttons; link targets are under Other settings. Style controls include 1–6 columns, gap, card padding, corner radius, image height, and card colors. The grid defaults to one column at 768px and below; set Mobile overrides columns to change that independently of desktop.
- **Call to Action:** a compact heading, description, and button. Clear the button text to hide it. Choose a URL or project-page destination and opening target. Style controls include alignment, content width, heading size, and button palette colors.
- **Video:** enter a direct MP4/WebM media URL or a Vimeo link, an optional poster image URL, and a caption displayed below the player. YouTube page embeds and timed subtitle tracks are not supported. Other settings includes native controls, autoplay, loop, mute, and heading level. Autoplay forces muted playback and remains subject to browser policy. The editor disables autoplay and uses no preload for direct files; use the native controls to start playback. Style controls include maximum width, aspect ratio, fit, and heading/caption sizes.
  **Vimeo:** paste a `vimeo.com/ID`, `vimeo.com/ID/HASH` (unlisted), channel/group, or `player.vimeo.com/video/ID` link and the block embeds Vimeo's player (only exact `vimeo.com`/`player.vimeo.com` hosts are accepted; embeds use `dnt=1`). Native controls, loop, mute, and autoplay map to the player options; autoplay is still off in the editor and always muted. Vimeo shows its own thumbnail, so the poster image applies only to direct files, and the embed loads from Vimeo when rendered (including in the editor). Whether a video may be embedded or its controls hidden is set in the Vimeo account. YouTube page URLs remain unsupported.

Card imports reject duplicate card IDs and malformed link data. Video imports validate playback booleans. New size fields accept px/rem/ch, with heading and caption sizes defaulting to rem.

## FAQ Block

Choose **FAQ** under **Add element** to insert a question-and-answer block. Edit its title, questions, and multiline answers in **Content**. Use **Add question**, the Material Symbols up/down arrows, and the delete icons to manage the list; the controls match the menu and footer settings. Alignment, colors, and spacing are in **Style**.

By default, questions expand or collapse independently using native disclosure controls with mouse and keyboard support. In **Other settings**, enable **Close other answers when opening one** to keep only one answer open within that FAQ block; other FAQ blocks remain independent. Mark the question-labeled **Open on start** switches for answers that should initially show. With exclusive opening enabled, only the first marked question in list order starts open; the other saved checkboxes are preserved for independent mode. With no questions marked, all answers start closed.

Question rows display a Material Symbols chevron after the text, pointing down when closed and up when open. The icon remains aligned at the end of wrapped questions, supports clicking anywhere on the row, and respects reduced-motion preferences.

Questions and answers are plain text: line breaks are preserved in answers, and HTML is displayed rather than executed. Title/content alignment and the shared wrapper, colors, padding, and margins are configurable. Empty lists are supported and remain selectable.

FAQ entries and opening options persist with the project and are included in JSON backups. Imports validate each entry's ID, question, answer, and optional opening booleans and reject duplicate entry IDs within a block. Older backups without these options keep independent, initially closed answers.

## Save and Load Project JSON

Open **Save & load** in the editor toolbar. The dropdown groups **Save to server** and **Save and Publish** under **Server**, and **Save as JSON** and **Load from JSON** under **JSON files**, with matching Material Symbols icons. Use Tab to move through actions and Escape or an outside click to close the dropdown; choosing an action also closes it.

- **Save as JSON** downloads a formatted `.json` file named after the current project. It includes all pages, blocks, colors, navigation, footer, and project settings—not login state or the editor's dark-mode preference. Image URLs are included; image files are not bundled. The button is disabled when no project is selected.
- **Load from JSON** opens a file picker, validates the file, and asks before replacing the current local draft. Export a backup first if you need to keep that draft. Invalid files display an error without replacing the draft; canceling leaves it unchanged.
- Imports reload the editor with the imported project's ID and `local=true`, so the preview, page list, and block/global settings use the restored data even when the ID matches the previous project. Reloading that editor URL resumes the imported draft. Loading also works from the editor's no-project state.
- The file is the plain project object, matching `ProjectType` in `src/types/types.ts`, without a wrapper. Validation checks nested data, registered block types, duplicate IDs, and missing/cyclic page parents. Empty projects are supported; additional fields and explicit size units are retained, and bare legacy size/spacing values receive px units.
- Only import files you trust. Project custom HTML, head markup, and styles are preserved, and scripts can run in the preview. JSON backup does not publish a site or add server storage.

## Current Limitations

- Project and editor state are browser-local; there is no database or cross-device synchronization.
- Sign-in is a local demo flow, not production authentication.
- The editor's **Save to server** and **Save and Publish** buttons are placeholders; publishing is not implemented.
- Content blocks can be drag-reordered, but pages cannot yet be reordered by drag and drop.

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
  import Textarea from '../../components/Textarea.svelte';
  import Styles from '../shared/Styles.svelte';

  const { update, activeTab = 'content' }: BlockEditorProps = $props();
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

<div hidden={activeTab !== 'content'}>
  <Textarea id="quote-content" label="Quote:" value={quote} oninput={updateContent} />
</div>

<div hidden={activeTab !== 'style'}>
  <Styles />
</div>
```

Each block chooses the style controls it exposes using [Styles.svelte](./src/blocks/shared/Styles.svelte). It includes the Styles heading and defaults to `sections={['wrapper', 'colors', 'padding', 'margin']}`. Pass a subset in the desired order, such as `sections={['colors', 'padding']}`, to select which controls appear; an empty list hides the entire section. Set `allowCenter` to enable the wrapper's Center option. To insert block-specific fields, include `'custom'` at the desired position and pass those fields as child content, as in the Split Block editor. Individual controls remain available in [blocks/shared](./src/blocks/shared).

Style controls use the settings context from `getStyleEditor()` in `src/utils/editor-style.ts`: `read(key)` returns the effective inherited string/number, `checked(key)` reads boolean fields, and `set(key, value)` updates only the selected mode. Shared `ColorSelect`, `TextAlign`, spacing, and wrapper controls handle this internally and no longer take element/update props. Custom controls must use the context rather than mutate the selected block's normal styles directly. The context is editor-only; never import it from preview code.

Each block editor receives `activeTab` through `BlockEditorProps`. Group its fields using native `hidden` wrappers for `content`, `style`, and optional `other`; do not conditionally mount/unmount the editor on tab changes. The settings panel owns the tab navigation, accessible panel label, and generic Other details.

For boolean settings, use [Checkbox.svelte](./src/components/Checkbox.svelte) with `id`, `label`, `checked`, and `oninput` props. It displays a toggle switch with an animated thumb, a clickable label, keyboard focus feedback, and optional `disabled` support. A native checkbox with `role="switch"` preserves keyboard interaction and exposes its state to assistive technology; animations respect reduced-motion preferences.

For dropdowns, use [Select.svelte](./src/components/Select.svelte). It uses `Field.svelte` for the `ui-field` wrapper and associated label, wraps a native single-select, accepts native attributes and `oninput`/`onchange` handlers, and supports typed `bind:value`. Provide a `label`; `id` is optional and defaults to a unique generated ID. Pass options as child content so dynamic lists and conditional options remain local to the caller. Project panels can set `wrapperClass` for their field layout and `hint` for helper text beneath the select.

For input fields, use [Input.svelte](./src/components/Input.svelte). It uses the same field wrapper and associated label, generates an ID when omitted, and forwards native attributes and events. It defaults to `type="text"` and also supports URL, number, color, email, password, search, and telephone fields. Use `bind:value` when needed; number inputs retain native Svelte numeric binding (including `undefined` when cleared). Use `wrapperClass` to preserve grouped or project-specific layouts and `hint` for helper text. Keep hidden transport fields native, use `Checkbox.svelte` for boolean switches, and use `Textarea.svelte` for multiline content.

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

The section's `data-id` enables selection from the preview. The `scms_<id>` class connects the block to generated scoped CSS, and the wrapper class honors its editor setting. Render content using escaped expressions; use the existing `sanitizeHref` helper from [helpers.ts](./src/blocks/shared/helpers.ts) for block links or image URLs. Keep browser-only editor state out of Astro preview imports.

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

CSS hooks receive the effective item and an optional third `mode` argument (`normal` or `mobile`). Normal markup is reused on mobile; class-based presentation such as wrappers, buttons, and flipped layouts must be overridden with CSS rather than duplicating content. Keep responsive declarations below normal rules and use the shared breakpoint.

### 6. Verify the block

Run `npm run check` and `npm test`. The registry-driven tests in
[blocks.spec.ts](./tests/e2e/blocks.spec.ts) automatically exercise insertion,
shared styles, persistence, and deletion for registered blocks. Add a dedicated
test there for the new block's content controls and preview output, and extend
the project fixture in [fixtures.ts](./tests/e2e/fixtures.ts) as needed.

Then open a project in the editor and verify:

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
- [ ] Drag-and-drop page reordering (content blocks can already be reordered)
- [ ] Project edit form validation

## License

ISC — © Alireza Balouch
