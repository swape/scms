## 2026-11-28

- Files: `src/blocks/Video/{vimeo.ts,Preview.astro,css.ts,videoStyles.css,index.svelte}`, `tests/e2e/blocks.spec.ts`, `README.md`
- Added Vimeo support to the Video block: public, unlisted, channel and player URLs render an embedded player with playback options mapped to the player; look-alike hosts are rejected.
- Verified URL parsing, embed URLs, editor autoplay suppression, and standalone autoplay with Vimeo stubbed; 21 block tests and type checks pass. Not checked against live Vimeo.

- Files: `src/components/FileSelector/index.svelte`, `src/components/editor/Settings.svelte`, `src/blocks/{Image,SplitBlock,Hero,CardGrid,Video}/index.svelte`, `tests/e2e/blocks.spec.ts`, `README.md`
- Added file selection and custom URL options to every block image field, including card images and video posters. Gave each picker a unique popover ID and made shared field updates immutable so file choices immediately updated source inputs.
- Verified file/custom URL switching and reloads for all five image surfaces; all 64 browser checks passed, including five temporary smoke cases. Retained image-sync and multi-card picker regression coverage and removed the temporary smoke file. Type checks passed with no errors.

- Files: `src/blocks/{CardGrid,CallToAction,Video}/*`, `src/components/editor/elements-list.ts`, `src/types/types.ts`, `src/utils/project-json.ts`, `src/pages/preview/{ElementSelector,index}.astro`, `tests/e2e/blocks.spec.ts`, `README.md`
- Added Card Grid, Call to Action, and native Video blocks with reusable controls, mobile styles, palette colors, and validated JSON persistence. Preserved native video controls and disabled editor autoplay while keeping configured muted autoplay in standalone previews.
- Fixed Card Grid list reactivity discovered during smoke verification and retained regression coverage for edits, destinations, ordering, mobile columns, and duplicate-card import rejection.
- Verified desktop/phone layouts and actual video decoding/playback. Type checks, all 25 block/responsive tests, and three targeted smoke scenarios passed. Removed the temporary smoke file and generated video fixture afterward.

- Files: `src/blocks/Hero/{index.svelte,Preview.astro,css.ts,heroStyles.css}`, `src/components/editor/elements-list.ts`, `README.md`
- Added Hero with editable heading, description, background image, optional link button, reusable settings controls, palette colors, dimensions, overlay, and mobile overrides.
- Verified insertion, styling, persistence, deletion, content editing, link targets, image removal, heading levels, responsive sizes, and JSON parsing. Type checks and the Hero registry test passed; the temporary interaction smoke scenario also passed and was removed.

## 2026-11-20

- Files: `src/components/project/{Edit,Fonts}.svelte`, `src/utils/project-fonts.ts`, `tests/e2e/pages.spec.ts`, `README.md`
- Added separate heading and body font pickers and stored their choices in marked blocks in the existing extra HTML and CSS fields.

- Files: `src/components/SizeInput.svelte`, `src/blocks/shared/Margin.svelte`, `src/types/types.ts`, `src/pages/preview/cssHelpers.ts`, `tests/e2e/responsive.spec.ts`, `README.md`
- Added Auto as an optional inline margin value in Normal and Mobile overrides.

- Files: `src/blocks/shared/Margin.svelte`, `src/pages/preview/cssHelpers.ts`, `src/utils/projects.ts`, `tests/e2e/responsive.spec.ts`, `README.md`
- Added inline start and end margins to shared block settings, with independent units and mobile overrides.

- Files: `src/store.ts`, `src/components/editor/{EditorTopMenu,PreviewWrapper}.svelte`, `tests/e2e/responsive.spec.ts`, `README.md`
- Added a toolbar control to cycle through desktop, tablet, and phone preview widths without reloading the iframe.

- Files: `src/components/editor/Settings.svelte`, `src/utils/editor-style.ts`, `src/constants.ts`, `src/types/types.ts`, block/shared Svelte style controls, `src/blocks/{Link,SplitBlock}/css.ts`, `src/blocks/Menu/Menu.astro`, `src/pages/preview/{cssHelpers.ts,index.astro}`, `src/utils/{projects,project-json}.ts`, `tests/e2e/responsive.spec.ts`, `README.md`
- Added Normal/Mobile overrides subtabs with sparse inherited style editing and reset; routed all existing appearance controls through a shared editor-only context without overwriting content or normal values.
- Generated mobile CSS at <=768px for block appearance, wrappers, Link/Split booleans, page palettes, and menu layout/colors; kept desktop behavior unchanged at769px. Preserved false, zero, explicit None, and independent units.
- Validated/persisted mobileStyle in JSON and local drafts, preserved pending page/footer edits, and fixed reactive mode switching to read mobile overrides directly from stores.
- Verified the actual iframe boundary at768/769px, mode separation, reset, keyboard access, sparse inheritance, JSON restore, and malformed override rejection. All49 browser tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: `src/components/Tabs.svelte`, `src/components/editor/Settings.svelte`, `src/types/types.ts`, all nine `src/blocks/*/index.svelte` editors, `tests/e2e/{blocks,editor,global-blocks,pages}.spec.ts`, `README.md`
- Added Content, Style, and Other settings tabs with keyboard navigation and a labeled panel; kept controls mounted to preserve pending edits and size-unit choices.
- Grouped every block/page/global editor by content, appearance, and behavior; moved FAQ opening controls, menu stickiness, page order, and link targets into Other settings alongside element details.
- Kept tabs in the sticky pinned/floating header and reset to Content only when the selection changed.
- Verified field visibility, keyboard focus, draft/unit retention, FAQ question-linked toggles, menu tab behavior, floating movement/pinning, and mobile containment. All 45 browser tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: `src/components/SizeInput.svelte`, `src/types/types.ts`, `src/blocks/shared/{css,helpers}.ts`, `src/blocks/shared/{Padding,Margin}.svelte`, `src/blocks/{Text,Header,SplitBlock}/index.svelte`, rendered block spacing styles, `src/styles/preview.css`, `src/pages/preview/cssHelpers.ts`, `src/utils/{elements,project-json}.ts`, `tests/e2e/blocks.spec.ts`, `README.md`
- Added reusable px/rem/ch size controls with independent units, fractional inputs, empty-value handling, and block-scoped pending unit selection; replaced every existing dimension input while leaving numeric counts/order unchanged.
- Defaulted new spacing and dimensions to px, kept font styling in rem, and preserved explicit saved units through CSS generation, JSON imports, and reloads. Changing units retained the entered number.
- Fixed Split Block min-width constraints so its default minimum image height did not create horizontal mobile overflow.
- Verified pixel defaults, legacy/rem/ch restoration, negative/zero/fractional values, clearing, JSON roundtrips, independent sides, and mobile layouts. All 44 browser tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: sizing styles in `src/components/`, `src/blocks/`, `src/styles/`, `src/pages/{index,project,404}.astro`; `src/blocks/shared/{css,helpers}.ts`; `src/pages/preview/cssHelpers.ts`; `src/utils/{projects,elements,project-json}.ts`; `tests/e2e/blocks.spec.ts`; `README.md`
- Converted authored fixed pixel dimensions, typography, spacing, borders, shadows, icons, and breakpoints to rem at 16px equivalence; retained responsive units, intrinsic/SVG dimensions, and browser coordinate units.
- Converted spacing/radius/size controls to fractional rem inputs and explicit rem storage; normalized legacy numeric/pixel settings on draft/JSON loading without double-converting existing rem values.
- Made floating-panel positions and viewport insets root-size aware while retaining pixel pointer math and keyboard increments; observed panel/header resizing to preserve containment.
- Verified unchanged default dimensions, legacy import/reload behavior, zero/negative/fractional values, 20px root scaling, rem-position dragging, and mobile containment. All 43 browser tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: `src/components/project/{Colors,ColorPair,index}.svelte`, `src/types/types.ts`, `src/utils/projects.ts`, `tests/e2e/pages.spec.ts`, `README.md`
- Grouped project palette entries into Background and Text sections with reusable light/dark cards, editable labels, and per-group Add color pair actions; retained stable keys and preserved imported custom-key colors.
- Allocated unused color keys, focused new labels, saved palette changes to the current draft, and restored matching drafts on the project page without losing page content.
- Verified desktop/mobile layout, label/value editing, additions to empty/populated palettes, imported-key collisions, reload and JSON persistence, selector labels, and light/dark preview rendering. All 42 browser tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: `src/blocks/Menu/MenuItem.astro`, `tests/e2e/global-blocks.spec.ts`, `README.md`
- Made menu links render the edited item title instead of stale link-settings text, fixing top-level and nested label updates as well as dropdown-to-link conversions.
- Verified updated labels and unchanged destinations in the live preview; added regression coverage for nested links, reload persistence, and type conversion. All five global-block browser tests and Astro checks passed.

- Files: `src/components/Textarea.svelte`, `src/components/project/Edit.svelte`, `README.md`
- Added a visible default textarea border while retaining the shared blue focus highlight; migrated remaining project-edit textareas to the shared component, preserving bindings and 200–500px height limits.
- Verified idle/hover/focus border colors and project textarea dimensions in the browser. Both affected editing tests and Astro checks passed.

- Files: `src/components/editor/EditorTopMenu.svelte`, `tests/e2e/editor.spec.ts`, `README.md`
- Renamed Preview theme to Toggle dark mode, used the visible label as its accessible name, and preserved toggle behavior.
- Verified the displayed label in the editor and passed the dark-mode/reload browser test.

- Files: `src/layouts/FrontPageLayout.astro`, `src/styles/global.css`, `src/pages/{index,dashboard}.astro`, `src/components/Login.svelte`, `src/components/projects/index.svelte`, `tests/e2e/pages.spec.ts`, `README.md`
- Applied the editor's charcoal theme, typography, compact navigation, active-page accents, and rounded surfaces to Home and Dashboard; replaced page-specific old-color styling with shared application classes.
- Migrated authentication and project actions to shared Button/Icon controls and restyled projects as responsive cards with descriptive accessible names.
- Verified desktop/mobile appearance, project creation/opening, active navigation, sign-in/out, and reload behavior. All 25 affected page/editor tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: `src/components/{Button,Icon,Field,Input,Select,Checkbox,Textarea,PanelSection}.svelte`, `src/components/editor/{Sidebar,ListPages,ListPagesContent,ElementsList,PageElements,Settings,EditorTopMenu}.svelte`, `src/components/FileSelector/index.svelte`, `src/blocks/{FAQ,Footer,Menu,Text,SplitBlock,Image}/index.svelte`, `src/blocks/shared/{Styles,Margin,Padding}.svelte`, `src/blocks/Image/figureStyles.css`, `src/types/types.ts`, `src/styles/global.css`, `src/pages/editor.astro`, `tests/e2e/{blocks,editor,global-blocks,pages}.spec.ts`, `README.md`
- Restyled the sidebar and inspector around Figma's own compact charcoal UI, separated page/layer/property sections, and added responsive stacked panels while preserving floating settings movement and edits.
- Centralized visible buttons, icons, fields, switches, textareas, and panel sections in reusable typed components; migrated all editor/block/file-picker controls and removed duplicated button/form styles.
- Fixed tall preview images overflowing their figure and covering adjacent blocks at the wider preview size. Updated semantic control selectors and removed an icon-text assertion that pinned presentation rather than behavior.
- Verified desktop/narrow layouts, fields and palettes, FAQ controls, popover Escape/focus, drag bounds, resize containment, both drag axes, and pinning without data loss. All 40 browser tests passed with retries disabled; Astro checks reported zero errors, warnings, or hints.

- Files: `src/blocks/Menu/{index.svelte,Menu.astro,menuStyles.css}`, `src/pages/preview/index.astro`, `src/types/types.ts`, `src/utils/{projects,project-json}.ts`, `tests/e2e/{fixtures,global-blocks.spec}.ts`, `README.md`
- Added a persisted Sticky menu switch and moved the menu's header into the menu component so sticky positioning spans the page rather than a short parent wrapper.
- Replaced literal-color inputs with the shared project palette selectors, used palette variables for the menu and dropdowns, updated defaults and fixtures, and validated the optional sticky boolean in JSON imports.
- Verified sticky/nonsticky scrolling, stacking and dropdown colors, light/dark palettes, modified palette values, primary-color fallback, reload/JSON persistence, invalid sticky rejection, and narrow vertical navigation. All 19 affected browser tests and Astro checks passed.

- Files: `src/blocks/FAQ/{Preview.astro,faqStyles.css}`, `src/pages/preview/index.astro`, `README.md`
- Replaced native FAQ markers with trailing Material Symbols chevrons, added row spacing and hover feedback, and rotated the icons with disclosure state while preserving native keyboard behavior.
- Loaded the existing Material Symbols font in previews containing FAQ blocks and kept icons decorative for assistive technology.
- Verified loaded icons, trailing alignment on desktop and wrapped narrow-screen questions, initial-open rendering, icon clicks, exclusive opening, and keyboard focus/toggling in the live preview. Astro checks passed without errors or warnings.

- Files: `src/blocks/FAQ/{index.svelte,Preview.astro}`, `src/types/types.ts`, `src/utils/project-json.ts`, `README.md`
- Added a block-level close-others switch and per-question Open on start checkboxes, persisted their optional booleans, and validated them during JSON import.
- Used native named disclosure groups scoped to each FAQ block, kept only the first marked question initially open in exclusive mode, and preserved all saved initial-open choices.
- Verified initial-state combinations, mouse/keyboard exclusive opening, isolation between FAQ blocks, switching back to independent mode, reload persistence, JSON roundtrips, and invalid boolean rejection in the live editor. Astro checks passed without errors or warnings.

- Files: `src/utils/project-json.ts`, `tests/e2e/fixtures.ts`
- Expanded all 32 unbraced one-line control statements into multiline braced blocks without changing their conditions or bodies.
- Scanned 83 project source, test, configuration, and documentation files, including Svelte scripts/template handlers and Astro scripts; found no remaining unbraced or single-line control bodies. Formatted the changed files, passed Astro checks without errors or warnings, and passed all 40 browser tests.

- Files: `src/blocks/FAQ/{index.svelte,Preview.astro,css.ts,faqStyles.css}`, `src/types/types.ts`, `src/components/editor/elements-list.ts`, `src/utils/project-json.ts`, `src/pages/preview/index.astro`, `tests/e2e/blocks.spec.ts`, `README.md`
- Added a registered FAQ block with editable questions and multiline answers, matching Material Symbols reorder/delete controls, shared styles, and escaped native disclosure previews.
- Preserved native summary activation in the preview selection handler and validated FAQ entries during JSON import, including duplicate IDs and malformed fields.
- Verified insertion, editing, mouse/keyboard disclosure, both reorder directions, removal through an empty list, reload persistence, JSON validation, and escaped HTML in the live editor; all 11 block tests and Astro checks passed. Removed a defaults-copy assertion that tested registry implementation rather than behavior.

- Files: `src/blocks/Menu/index.svelte`, `README.md`
- Replaced menu settings Up, Down, and Remove text with Material Symbols arrows and a delete icon, retained accessible labels and disabled states, and added hover tooltips.
- Verified the rendered icons and move-up, move-down, and removal actions in the running editor; Astro checks reported no errors or warnings.

- Files: `src/blocks/Footer/index.svelte`, `README.md`
- Matched footer item cards and action controls to the menu, grouped Material Symbols arrows and delete icons in each item header, and retained accessible labels, tooltips, and disabled states.
- Verified matching computed button styles, saved reorder/removal results, and disabled boundary controls in the running editor; Astro checks reported no errors or warnings.

- Files: `src/components/editor/{EditorTopMenu,Settings}.svelte`, `src/blocks/{Page,Footer}/index.svelte`, `src/blocks/shared/helpers.ts`, `src/utils/{editor-save,project-json}.ts`, `src/localstorage.ts`, `tests/e2e/editor.spec.ts`, `README.md`
- Added whole-project JSON downloads and validated file imports with replacement/trusted-content confirmation, error messages, selection reset, and local-draft reload.
- Made delayed block, page, and footer edits synchronously flushable before export/import, captured edits after store updates, and canceled stale save callbacks.
- Added backup/import data-loss regression coverage, removed placeholder-alert wording tests, and made preview-order assertions tolerate iframe navigation.
- Verified the toolbar visually, JSON validation and pending-save boundaries, all 38 browser tests, and Astro type checks.

- Files: `src/components/editor/EditorTopMenu.svelte`, `README.md`
- Renamed the editor's Save button to Save to server without changing its behavior, and verified the label in the running editor.

- Files: `src/components/editor/EditorTopMenu.svelte`, `tests/e2e/editor.spec.ts`, `README.md`
- Grouped the four save/load actions under a native Save & load dropdown with Server and JSON files sections, matching Material Symbols icons, and action dismissal without changing save/import behavior.
- Verified desktop and narrow layouts, keyboard access, Escape/outside-click dismissal, all nine editor tests including JSON roundtrips, and clean Astro diagnostics.

- Files: `src/components/editor/Settings.svelte`, `src/styles/global.css`, `tests/e2e/editor.spec.ts`, `README.md`
- Replaced Toggle width with explicit floating/pinned settings modes, action-specific icons and labels, a persistent panel header, and a bounded floating overlay below the toolbar.
- Released the sidebar column to the preview while floating and restored it on pinning without remounting the active editor or losing edits.
- Verified desktop/narrow layouts, keyboard pinning, the visible pin control while scrolling, all ten editor tests, and clean Astro diagnostics.

- Files: `src/components/editor/Settings.svelte`, `tests/e2e/editor.spec.ts`, `README.md`
- Made the floating settings header draggable with pointer capture across the preview, a grab handle, viewport clamping, resize handling, and keyboard movement; kept pin and form controls independent.
- Preserved the panel size and edits during dragging, cleared pointer capture on release/cancel, and reset custom coordinates when pinning.
- Verified mouse dragging, pointer release, viewport bounds, keyboard movement, resize containment, pin restoration, all ten editor tests, and clean Astro diagnostics.

- Files: `src/components/editor/Settings.svelte`, `tests/e2e/editor.spec.ts`, `README.md`
- Removed bottom-stretched floating height and used a compact responsive height with internal scrolling, leaving room to drag downward as well as upward and sideways.
- Removed fixed drag-height overrides and recalculated vertical bounds from the rendered size on window resize.
- Verified downward movement from the initial position, upward/sideways movement, resized-window movement, all ten editor tests, and clean Astro diagnostics.

## 2026-10-25

- File: `README.md`
- Updated the project structure with complete block files, page route descriptions, stylesheets, and Playwright test and automation files.

- Files: `package.json`, `package-lock.json`, `playwright.config.ts`, `tests/e2e/{fixtures.ts,pages.spec.ts,blocks.spec.ts,editor.spec.ts,global-blocks.spec.ts}`, `.github/workflows/playwright.yml`, `.gitignore`, `.prettierignore`, `README.md`
- Set up Playwright Chromium tests, isolated local project fixtures, and CI reporting; covered all page routes and block editors/previews, persistence, page management, global settings, and responsive layout; documented browser test commands.
- Verified all 37 browser tests, Astro checks, TypeScript checks, and targeted Prettier checks.

- File: `src/blocks/shared/Padding.svelte`
- Narrowed selected elements before accessing padding styles and replaced an unassociated label.

- File: `src/blocks/shared/Margin.svelte`
- Narrowed selected elements before accessing margin styles and replaced an unassociated label.

- File: `src/blocks/shared/TextAndBackgroundColors.svelte`
- Narrowed the selected element before passing its style to the color update helper.

- File: `src/blocks/shared/Wrapper.svelte`
- Narrowed the selected element before reading or updating its wrapper style.

- File: `src/blocks/Page/index.svelte`
- Narrowed the selected element to a page before reading or updating its order.

- File: `src/blocks/Text/index.svelte`
- Narrowed the selected element before reading or updating text block styles.

- File: `src/components/project/Edit.svelte`
- Initialized the required menu and footer fields in the project editor state.

- File: `src/blocks/shared/helpers.ts`
- Consolidated the repeated default link-settings shape into one private factory.

- Files: `src/blocks/shared/{defaults.ts,helpers.ts}`, `src/blocks/Link/index.svelte`, `src/components/editor/elements-list.ts`, `README.md`
- Moved the registry's link defaults into `helpers.ts` and renamed the Link editor-specific fallback to preserve its distinct text default.

- Files: `src/blocks/shared/{helper.ts,helpers.ts}`, shared helper callers, `README.md`
- Combined the editor helpers into `helpers.ts` and injected the selected-element store to keep the module free of runtime store dependencies.

- Files: `src/blocks/shared/helper.ts`, `src/blocks/shared/helpers.ts`, `src/blocks/{Link,SplitBlock}/index.svelte`, `README.md`
- Moved Link and Split Block default link factories into the shared helper module while keeping them independent of project-store imports.

- Files: `src/blocks/Link/index.svelte`, `src/blocks/shared/helper.ts`
- Moved the Link block's default link-settings factory into the shared editor helpers.

- Files: `src/blocks/SplitBlock/index.svelte`, `src/blocks/shared/helper.ts`
- Moved Split Block's link-settings factory into the shared editor helpers.

- File: `src/utils/elements.ts`
- Removed the unused re-export of shared link defaults; the editor registry imports them directly from their shared defaults module.

## 2026-10-23

- File: `src/blocks/SplitBlock/index.svelte`
- Used the narrowed Split Block selection when reading style properties, resolving selected-element union type errors.

- File: `src/blocks/SplitBlock/splitBlockStyles.css`
- Added a minimum height to Split Block images so the image area remains visible when the text content is short.
- Files: `src/blocks/SplitBlock/{index.svelte,css.ts}`, `README.md`
- Added an editor setting for Split Block image minimum height, defaulting to 300px, and applied saved values in generated preview CSS.

- File: `README.md`
- Clarified current editor capabilities, browser-only prototype limitations, project structure, and page-reordering roadmap.

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
