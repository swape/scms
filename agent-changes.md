## 2026-10-23

- File: `src/blocks/Footer/index.svelte`
- Added Up and Down controls to reorder footer elements and save their new order.

- File: `src/blocks/Header/index.svelte`
- Narrowed the selected element to content blocks before reading Header fields and styles, resolving union type errors.

- File: `src/blocks/Footer/index.svelte`
- Debounced footer text, URL, and HTML input saves by 500 ms while keeping discrete actions immediate.
- Cloned footer editor data on load and save so typing does not mutate project settings before the debounce expires.
- Replaced `structuredClone` with explicit Footer element cloning to support Svelte's proxied state values.
- Updated Footer fields immutably before scheduling saves, following the Header editor's update-then-debounce flow.

- Files: `src/blocks/Footer/{Footer.astro,index.svelte}`, `src/blocks/Menu/{Menu.astro,index.svelte}`, `src/components/editor/{elements-list.ts,Settings.svelte}`, `src/components/project/index.svelte`, `src/pages/preview/index.astro`, `src/styles/preview.css`, `src/types/types.ts`, `src/store.ts`, `src/utils/footer.ts`, `README.md`
- Added preview-selectable project-global Footer and Menu editors, moved their controls out of project settings tabs, and kept edits independent of the selected page.
- Corrected the relocated Footer and Menu editors' shared input imports so their settings load successfully.

- Files: `src/blocks/Footer/{Footer.astro,footerStyles.css}`, `src/blocks/Menu/{Menu,MenuItem,MenuItems}.astro`, `src/blocks/Menu/menuStyles.css`, `src/pages/preview/index.astro`, `README.md`
- Capitalized the Footer and Menu block directory names and updated their imports and documentation.

- Files: `src/blocks/Footer/{Footer.astro,footerStyles.css}`, `src/blocks/Menu/{Menu,MenuItem,MenuItems}.astro`, `src/blocks/Menu/menuStyles.css`, `src/pages/preview/index.astro`, `README.md`
- Moved the footer and menu preview components into their own block directories and updated the preview imports and project structure documentation.

- Files: `src/blocks/Image/Preview.astro`, `src/blocks/Image/figureStyles.css`, `src/styles/preview.css`, `README.md`
- Moved figure and image sizing styles into a stylesheet imported by the Image preview.

- Files: `src/blocks/Link/{Preview.astro,linkStyles.css}`, `src/blocks/SplitBlock/Preview.astro`, `src/styles/preview.css`, `README.md`
- Moved shared link classes into the Link block stylesheet and imported it where both Link and Split Block previews use them.

- Files: `src/blocks/SplitBlock/Preview.astro`, `src/blocks/SplitBlock/splitBlockStyles.css`, `src/styles/preview.css`, `README.md`
- Moved Split Block-specific styles into a colocated stylesheet imported by its preview component.

- Files: `src/blocks/Page/Menu.astro`, `src/blocks/Page/menuStyles.css`, `src/styles/preview.css`, `README.md`
- Moved menu-specific styles, including mobile overrides, into a colocated stylesheet imported by the menu component.

- Files: `src/blocks/Page/Footer.astro`, `src/blocks/Page/footerStyles.css`, `src/styles/preview.css`, `README.md`
- Moved footer-specific styles into a colocated stylesheet imported by the footer component.

- Files: `src/blocks/shared/helpers.ts`, preview component imports, `src/previewRender/common.ts`, `README.md`
- Moved URL sanitization into the shared preview helpers and updated consumers and documentation.

- Files: `src/blocks/Page/{Footer,Menu,MenuItem,MenuItems}.astro`, `src/pages/preview/index.astro`, `README.md`
- Moved the preview menu and footer components into the Page block directory, updated their imports, and documented the new structure.

## 2026-10-22

- Files: `src/blocks/shared/Styles.svelte`, `src/types/types.ts`, `src/blocks/{Header,Image,Link,SplitBlock,Text}/index.svelte`, `README.md`
- Replaced duplicated style panels with configurable ordered sections, preserved image centering and Split Block custom fields, and documented the shared component.

- Files: `src/blocks/shared/helper.ts`, `src/blocks/{Header,Image,Link,SplitBlock,Text}/index.svelte`
- Extracted shared block-field, numeric-style, and selected-link update behavior into block helpers and reused it across the editors.
- File: `src/blocks/shared/TextAndBackgroundColors.svelte`
- Reused a shared style-color helper for background and text color updates.
- Files: `src/blocks/shared/helper.ts`, `src/blocks/shared/TextAndBackgroundColors.svelte`
- Resolved editor type diagnostics by annotating color callback events and using exported interface types in helper signatures.

- Files: `src/components/Input.svelte`, `src/types/types.ts`, input callers in `src/blocks` and `src/components/project`, `README.md`
- Added a reusable labeled input component with generated IDs, native attributes/events, value binding, and numeric empty-value handling.
- Migrated text, URL, number, and color fields, including grouped spacing controls and project settings, while preserving hidden transport inputs and the switch's native checkbox.
- Updated scoped project styles for component-owned fields and provided distinct accessible labels for paired palette inputs.

- Files: `src/components/Select.svelte`, `src/types/types.ts`, select callers in `src/blocks` and `src/components/project`, `README.md`
- Moved select field wrappers and associated labels into the shared component, added generated IDs and optional layout/helper-text props, and removed caller-owned select labels and wrappers.
- Made Split Block link updates immutable so its derived editor state refreshed when changing destinations.
- File: `src/blocks/Image/index.svelte`
- Gave the caption-alignment select its own ID so both alignment labels targeted the correct controls.

- Files: `src/components/Select.svelte`, `src/types/types.ts`, `src/blocks/{Header,Link,SplitBlock}/index.svelte`, `src/blocks/shared/{ColorSelect,Padding,TextAlign,Wrapper}.svelte`, `src/components/project/{ProjectFooter,ProjectMenu}.svelte`, `README.md`
- Added a typed reusable native select component and migrated all dropdowns while retaining options, event handlers, two-way bindings, labels, and existing styling.
- Adjusted the menu's scoped select styling to reach the shared component's native control and documented the component API.

- Files: `AGENTS.md`, `agent-changes.md`
- Replaced duplicated stack, architecture, and command information with README section links, removed outdated preview-rendering guidance, and retained repository-specific coding and workflow rules.

- Files: `src/components/Checkbox.svelte`, `README.md`
- Restyled the shared checkbox as an accessible toggle switch with an animated thumb, keyboard focus feedback, and reduced-motion support.

- Files: `src/components/Checkbox.svelte`, `src/types/types.ts`, `src/blocks/Link/index.svelte`, `src/blocks/SplitBlock/index.svelte`, `README.md`
- Replaced both checkbox wrappers with a shared typed native checkbox component featuring a clickable label, checked-state styling, keyboard focus feedback, and disabled support.

- Files: `README.md`, `agent-changes.md`
- Updated the source structure tree and expanded the new-block guide with editor, Astro preview, registry, optional CSS, and verification examples.

- Directories: `src/components/editor/elements`, `src/components/editor/stylingParts`, `src/pages/preview/elementParts`
- Removed empty legacy directories left after the block migration and verified that no empty directories remained under `src`.

- Files: `src/blocks/*`, `src/components/editor/Settings.svelte`, `src/components/editor/elements-list.ts`, `src/utils/elements.ts`, `src/types/types.ts`, `src/pages/preview/ElementSelector.astro`, `src/pages/preview/cssHelpers.ts`, `README.md`
- Moved all element editors and Astro block previews into `src/blocks`, colocated block-specific CSS, and moved reusable style controls into `src/blocks/shared`.
- Removed `Styling.svelte` and let each block compose its own style controls, including Split Block radius/text padding and Page palette settings.
- Replaced editor, creation-default, preview, and block-CSS type switches with typed registry definitions and lazy editor imports while preserving saved content types and existing page-color changes.
- Documented the block layout and single-registry workflow for adding blocks.

- Files: `src/types/types.ts`, `src/components/editor/elements-list.ts`, `src/utils/elements.ts`
- Added `flipped` field to `ContentType` and registered the Split Block element with its default title, content, and button link settings.
- File: `src/components/editor/elements/SplitBlock/index.svelte`
- Implemented Split Block editor settings: flip-sides toggle, text block title/content, text block background/text color, container border radius, button text/destination/target/colors, and image selection.
- File: `src/components/editor/Settings.svelte`
- Wired Split Block settings into the settings panel element-type switch.
- File: `src/pages/preview/elementParts/SplitBlock.astro`
- Added Split Block preview rendering with a text-and-button side and an image side.
- File: `src/pages/preview/ElementSelector.astro`
- Routed split block elements to the new preview component.
- File: `src/pages/preview/cssHelpers.ts`
- Added generated CSS for the split block's text background/text colors, button colors, and container overflow clipping for rounded corners.
- File: `src/styles/preview.css`
- Added responsive two-column layout styles for the split block, including the flipped-sides variant.
- File: `src/styles/preview.css`
- Forced the split block's image to render above the text on mobile (`order: -1`) regardless of the flip-sides setting.
- Files: `src/components/editor/elements/SplitBlock/index.svelte` and `src/pages/preview/cssHelpers.ts`
- Added a split block gap control (`style.splitGap`, px) between the text and image sides, with generated CSS applied to the container.
- Files: `src/pages/preview/elementParts/SplitBlock.astro` and `src/styles/preview.css`
- Rendered the split block's image as a CSS `background-image` on the image wrapper div instead of an `<img>` element, preserving accessibility via `role="img"`/`aria-label`.
- File: `src/pages/preview/cssHelpers.ts`
- Rescoped the split block's border radius and overflow clipping from the outer section to the text and image wrapper elements individually, so each side is rounded independently.
- File: `src/pages/preview/cssHelpers.ts`
- Removed border radius/overflow clipping from the split block's image wrapper; the container border radius now applies only to the text wrapper.
- File: `src/components/editor/elements/SplitBlock/index.svelte`
- Grouped the split block's title, content, text colors, and border radius under a "Wrapper:" settings section and relabeled the field "Wrapper border radius (px)".
- Files: `src/components/editor/elements/SplitBlock/index.svelte` and `src/components/editor/Styling.svelte`
- Moved the split block's border radius and image/text gap controls from the element-specific settings into the shared `Styling.svelte` panel, shown only when the selected element is a Split Block.
- Files: `src/components/editor/Styling.svelte`, `src/components/editor/elements/SplitBlock/index.svelte`, and `src/pages/preview/cssHelpers.ts`
- Removed border radius, background color, and text color options for the split block's text wrapper (`.split-text`); only the gap control and button/image options remain configurable.
- Files: `src/components/editor/Styling.svelte` and `src/pages/preview/cssHelpers.ts`
- Removed the split block's configurable gap control; `.split-block` now always uses the fixed default gap from `preview.css`.
- Files: `src/components/editor/elements/SplitBlock/index.svelte` and `src/pages/preview/cssHelpers.ts`
- Removed the split block's dedicated button background/text color selectors; the button now derives its colors from the wrapper's own background/text color settings, swapped (wrapper background becomes button text color, wrapper text color becomes button background).
- Files: `src/components/editor/Styling.svelte` and `src/pages/preview/cssHelpers.ts`
- Added a border radius control for the split block in the shared `Styling.svelte` panel, applying rounded corners with clipping to the outer `.split-block` wrapper.
- Files: `src/components/editor/Styling.svelte` and `src/pages/preview/cssHelpers.ts`
- Added a text padding control (`style.splitTextPadding`, px) for the split block's text wrapper (`.split-text`), overriding its default 24px padding.
- File: `src/components/editor/elements/Page/index.svelte`
- Added page-level background and text color selectors (`PageType.colors.backgroundColorKey`/`textColorKey`), replacing the TODO placeholder.
- Files: `src/pages/preview/cssHelpers.ts` and `src/pages/preview/index.astro`
- Exported `getColorValue` and generated a `body.preview-body { ... }` CSS rule from the selected page's background/text color, overriding the project-level default colors set in `preview.css`.
- File: `src/pages/preview/ElementSelector.astro`
- Widened the `data` prop type to `PageType | null` to match its existing optional-chaining usage.
- File: `src/pages/preview/index.astro`
- Fixed the dark-mode color-scheme script to set only `body.style.colorScheme` instead of replacing the entire inline style attribute.
- File: `src/pages/preview/index.astro`
- Moved the page's background/text color override from an inline `style` attribute on `<body>` to a dedicated `<style>` tag rendered as the first child of `<body>`, scoped to `body.preview-body` so it reliably overrides the project-level default without touching `.preview-body`'s base rule in `preview.css`.

## 2026-10-21

- File: `plan.md`
- Added a to-do for a separate Astro build-server repository with a project-number script that copies preview files and CSS, removes editor-only code, and generates static output.

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
