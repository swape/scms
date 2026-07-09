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
