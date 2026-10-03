## 2026-07-04

- File: `AGENTS.md`
- Rewrote the development guide to match the current repository structure, updated the stack to Astro 7/Svelte 5/Tailwind 4, and aligned workflow and script guidance with the current project setup.

## 2026-07-06

- File: `src/types/types.ts`
- Added typed link settings contracts to content elements.
- File: `src/components/editor/elements-list.ts`
- Added the Link element to the editor element picker.
- File: `src/components/editor/ElementsList.svelte`
- Added default link initialization when creating a new Link element.
- File: `src/components/editor/elements/Link/index.svelte`
- Added link element settings UI for text, target, URL or page destination, and button-style toggle.
- File: `src/components/editor/Settings.svelte`
- Wired Link settings into the settings panel element-type switch.

## 2026-07-07

- File: `src/components/editor/Styling.svelte`
- Fixed type errors by explicitly typing project color state and iterating over typed color values with safe fallbacks.

## 2026-07-09

- File: `src/previewRender/textView.ts`
- Added text element preview rendering with newline-to-`<br />` formatting and shared style wrapping.
- File: `src/previewRender/index.ts`
- Wired text elements into preview output generation.
- File: `src/previewRender/linkView.ts`
- Added link element preview rendering for URL and page destinations, including button-style output.
- File: `src/previewRender/index.ts`
- Wired link elements into preview output generation.
- File: `src/styles/preview.css`
- Added preview styling for inline and button-style rendered links.

## 2026-07-22

- File: `src/types/types.ts`
- Added `FooterElementType`, `SocialPlatform`, and `FooterElement` types; changed `ProjectType.footer.elements` from `MenuElement[]` to `FooterElement[]`.
- File: `src/utils/footer.ts`
- Created footer utility with factory functions (`createFooterLink`, `createFooterSocial`, `createFooterText`, `createFooterHtml`) and `saveFooterToProject` store helper.
- File: `src/components/project/ProjectFooter.svelte`
- Implemented footer editor: footer style selector, element list (link, social, text, custom HTML) with add/remove/edit, saved to project store.
- File: `src/components/project/index.svelte`
- Passed `id` prop to `<ProjectFooter>`.

## 2026-10-01

- File: `src/components/editor/elements/Header/index.svelte`
- Fixed the Header level control type error by narrowing the selected element to `ContentType`.

## 2026-10-03

- File: `src/previewRender/common.ts`
- Moved and exported the shared HTML escaping and href sanitizing helpers.
- File: `src/previewRender/footer.ts`
- Updated footer rendering to use the shared helpers.
- File: `src/components/project/ProjectMenu.svelte`
- Implemented hierarchical menu editing with page and external links, manual and automatic submenus, appearance controls, and item reordering.
- File: `src/components/project/index.svelte`
- Connected the menu editor to the current project.
- File: `src/types/types.ts`
- Added menu item identity and appearance settings to the project types.
- File: `src/utils/menu.ts`
- Added menu item creation and project persistence helpers.
- File: `src/previewRender/index.ts`
- Wired menu rendering and page selection into the preview.
- File: `src/previewRender/menuView.ts`
- Added menu preview rendering and page navigation for configured menu items.
- File: `src/store.ts`
- Synchronized preview page selection with the editor store.
- File: `src/styles/preview.css`
- Added responsive preview menu styles.

- File: `src/styles/global.css`
- Added a shared styled select control with consistent dropdown, hover, focus, and disabled states.
- File: `src/components/project/ProjectFooter.svelte`
- Removed component-specific select styling.
- File: `src/components/project/ProjectMenu.svelte`
- Removed duplicate select presentation rules while retaining menu sizing.
- File: `src/pages/preview.astro`
- Removed placeholder menu text from the preview header.
- File: `src/styles/global.css`
- Added a consistent global appearance for text inputs and textareas alongside selects.
- File: `src/components/project/Edit.svelte`
- Removed local input and textarea presentation rules while retaining textarea dimensions.
- File: `src/components/project/ProjectFooter.svelte`
- Removed local input and textarea presentation rules while retaining footer field sizing.
- File: `src/components/project/ProjectMenu.svelte`
- Removed the local input focus style in favor of the shared global state.
- File: `src/styles/global.css`
- Consolidated shared control states and replaced standard declarations with Tailwind utilities where practical.
