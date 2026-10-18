## 2026-10-18

- Files: `src/components/editor/PreviewWrapper.svelte` and `src/pages/preview/*`
- Rendered configured project menus and footers in the preview and included project pages for automatic menu items.
- File: `src/pages/preview/index.astro`
- Rendered configured extra head content as HTML in the preview document head.

## 2026-10-17

- File: `src/components/editor/PageElements.svelte`
- Highlighted the selected page element and exposed its selected state with `aria-pressed`.
- Files: `src/components/editor/PreviewWrapper.svelte` and `src/pages/preview/index.astro`
- Posted preview page data and project settings to the iframe and read them from the request body.
- Files: `src/pages/preview/elementParts/*.astro` and `src/pages/preview/elementSelector.astro`
- Applied each item’s configured wrapper class to all preview element roots.
- Files: `src/pages/preview/elementParts/*.astro` and `src/pages/preview/elementSelector.astro`
- Added the container class to non-header preview elements.
- File: `src/components/editor/PreviewWrapper.svelte`
- Delayed iframe rendering until page data and project settings were available and kept its URL reactive.
- Files: `src/pages/preview/elementSelector.astro` and `src/pages/preview/cssHelpers.ts`
- Moved per-item CSS generation into the CSS helper module.
- File: `src/components/editor/PreviewWrapper.svelte`
- URL-encoded preview page data and project settings with `URLSearchParams`.
- Files: `src/pages/preview/index.astro` and `src/pages/preview/cssHelpers.ts`
- Moved preview palette CSS generation into the `cssHelpers` function.
- File: `src/pages/preview/index.astro`
- Handled malformed preview settings JSON without interrupting rendering.
- Files: `src/pages/preview/index.astro` and `src/styles/preview.css`
- Added project light/dark color variables to the preview root and used the text variable for preview text.
- File: `src/pages/preview/elementSelector.astro`
- Combined generated CSS selectors when items shared identical declarations.
- File: `src/pages/preview/elementSelector.astro` and `src/pages/preview/elementParts/*.astro`
- Replaced element-level inline styles with item-scoped CSS generated through `combinedCss`.
- Files: `src/pages/preview/elementSelector.astro`, `src/pages/preview/elementParts/*.astro`, and `src/previewRender/*View.ts`
- Prefixed preview content element ID classes with `scms_`.
- Files: `src/pages/preview/ElementSelector.astro` and `src/pages/preview/elementParts/*.astro`
- Added each content element ID as a class in the Astro preview.
- Files: `src/previewRender/headerView.ts`, `textView.ts`, `imageView.ts`, and `linkView.ts`
- Added each content element ID as a class in the DOM-based preview renderer.
- File: `src/pages/preview/index.astro`
- Restored preview scroll position from session storage when reopening the same page and saved the position on page exit.
- File: `src/pages/preview/ElementSelector.astro`
- Routed header, text, image, and link elements to dedicated preview components.
- Files: `src/pages/preview/elementParts/Header.astro`, `Text.astro`, `Image.astro`, and `Link.astro`
- Added text, image, and link previews and rendered headers using their configured levels.

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
