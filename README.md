# scms

CMS from outer space

List of features:

- Front end in svelte and astro
- Back end in python and fastApi
- Database module with support for multiple databases (sqlite, postgres, firebase, supabase, etc)
- Authentication module with support for multiple authentication methods (jwt, oauth, firebase, supabase, etc)
- Docker support for all modules (frontend, backend, database, authentication)
- Support for publish to firebase hosting, github pages, vercel, netlify, etc
- Support for multiple languages (i18n)
- Support for multiple themes (light, dark, etc)
- Support for multiple users with different roles (admin, editor, viewer, etc)
- Support for both page-templates and page-builder
- Support for both markdown and wysiwyg editors
- Support for both static and dynamic content
- Support for import from other cms (wordpress, ghost, etc)
- Support for extract content from a url

List of technologies used:

- Front end: svelte, astro, tailwindcss, vite
- Back end: python, fastapi, uvicorn
- Database: sqlite, postgres, firebase, supabase
- Authentication: jwt, oauth, firebase, supabase
- Docker: docker, docker-compose
- Deployment: firebase hosting, github pages, vercel, netlify

All the modules are independent and can be used separately or together.
You can use the front end with your own hosted backend and database. Since they communicate via api and it is on its own docker files, you can choose what to pay for and what to host yourself.

The end product is static files that can be hosted anywhere. But can also have some dynamic content via backend api calls and serverless functions.

If supabase or firebase is used, the backend can be completely skipped and the front end can communicate directly with the database and authentication services.

But backend is still useful for server side rendering, custom api endpoints, webhooks, etc.

## Step by step guide to implement instructions from above

## TODO:

- [] Add top menu (with static and dynamic page listing)
- [] Add Footer component (with static and dynamic page listing)
- [] Add SEO component (with dynamic meta tags and social media tags)
- [] Add simple image block
- [] Add split block
- [] Add markdown block
- [] Add iframe block
- [] Add image gallery block

## Improvement Plan

### Critical — Bugs / SSR Crashes

1. **`window` at module level** — `store.ts:27`, `Login.svelte:4`, `editor/index.svelte:11`, `project/index.svelte:6`, `pageBuilderWrapper/index.svelte:7` call `window.*` at top-level script scope. Node.js throws `ReferenceError: window is not defined` during Astro build/SSR. Move into `$effect()` or `onMount`.
2. **`$derived` used for mutable state** — `elementSettings/BlockDivider.svelte:3`, `BlockText.svelte:3`, `PageElement.svelte:3` use `$derived(structuredClone(element))` then mutate via `bind:value`. `$derived` is read-only in Svelte 5; bindings silently fail. Replace with `$state` + `$effect` to sync from prop.
3. **`client:only` nesting** — `dashboard.astro`, `editor.astro`, `project.astro` place a `client:only="svelte"` island inside `AuthGate` which is also `client:only="svelte"`. Astro does not support nested `client:only` islands.
4. **`localStorage.setItem('scms', null)` bug** — `Login.svelte:24` passes `null` to `setItem`, which coerces to the string `"null"` instead of clearing the value.

### Security

5. **Hardcoded credentials and PII** — `Login.svelte:13–18` has `token: '12345'`, `uid: 123`, real developer name and email hardcoded in source. Must be removed before any production deployment.
6. **Placeholder theme-color meta tags** — `FrontPageLayout.astro:12` uses `#FF0000` and `PreviewLayout.astro:10` uses `#FF00FF`. Clearly placeholder values that were never updated.

### TypeScript

7. **All `<script>` tags missing `lang="ts"`** — All 17 `.svelte` files are missing `lang="ts"`. TypeScript strict mode is not active inside any component, making `tsconfig.json` `strict` effectively useless for component code.
8. **`userObj` and `selectedElement` stores untyped** — `store.ts:7,12` — Both are `Writable<null>`. Every component reading them gets `null` as the inferred type. Need `Writable<UserType | null>` and `Writable<ContentType | PageType | null>`. Requires adding a missing `UserType` interface to `types.ts`.
9. **`localstorage.ts` uses `any`** — `localstorage.ts:1,16,22` — `data: any` parameter and untyped `JSON.parse` return. Should use a generic `<T>` with a runtime guard.
10. **All `$props()` destructurings untyped** — Affects nearly every component. Props have no TypeScript annotations, eliminating all prop-checking.
11. **All function parameters untyped** — `handlePageClick(id)`, `changeAction(elm)`, `deleteElement(elm)`, `savePage(localElement)` etc. throughout editor components have no type annotations.
12. **Wrong type on `editor/helper.ts:4`** — `pagesObj` is typed as `PageType` (a single page) but the function calls `Object.values(pagesObj)` treating it as a dictionary. Correct type is `ProjectType['pages']`.
13. **`ProjectType.id` type inconsistency** — Typed `string | number` in `types.ts` but always produced as `string` and compared with `===` to string query params. Should be narrowed to `string`.
14. **`$derived` template literal "undefined" string bug** — `BlockDividerView.svelte:10`, `BlockTextView.svelte:10–12` — Template literals like `` `${block.colors?.backgroundColorKey}` `` produce the literal string `"undefined"` when absent, which gets applied as a CSS class name. Use `?? ''` fallback.
15. **`PageType.type` and `ContentType.type` missing literal unions** — Both typed as `string` but used as discriminators (`=== 'page'`). Should be union literal types.
16. **Missing `UserType` interface** — The `userObj` shape (`{ token, uid, name, email }`) has no interface defined in `types.ts`.
17. **Missing return type on `projects/helper.ts`** — `getEmptyProjectStructure` has no return type annotation.

### Svelte / Reactivity

18. **Store subscriptions at module level — memory leaks** — `PageListItem.svelte`, `editor/index.svelte`, `pageBuilderWrapper/index.svelte`, `Colors.svelte`, `Edit.svelte`, `project/index.svelte` all call `.subscribe()` without cleanup. Use the `$store` auto-subscription syntax or `$effect` with a returned unsubscribe function.
19. **SSR-unsafe store subscriptions in `store.ts`** — `store.ts:15–25` — `selectedPage.subscribe` and `currentProject.subscribe` both call `saveStorage` (→ `localStorage`) at module load time, which fires during SSR.
20. **`$state()` initialised without a value** — `PageListItem.svelte:7` — `let localSubPages = $state()` produces `undefined`. Accessing `.length` before any update throws. Should be `$state<PageType[]>([])`.
21. **Partial object used as state type in `Colors.svelte`** — `let project = $state({ title: '', colors: {} })` typed as anonymous partial; should be `$state<ProjectType | null>(null)`.
22. **Missing null guards on `$currentProject` accesses** — `PageBuilder.svelte:11,39`, `PagesList.svelte:21`, `ElementSettings.svelte:39`, `Colors.svelte:46` access `$currentProject` without null checks despite it being `ProjectType | null`.

### CSS

23. **Duplicated magic RGBA values** — `rgba(30, 30, 30, 0.8)` appears in `PageListItem.svelte:79` and `PagesList.svelte:59`; `rgba(0, 200, 20, 0.7)` and `rgba(0, 200, 20, 0.2)` repeated in both files. Extract to CSS custom properties or Tailwind utilities.
24. **Hardcoded hex values in `global.css`** — `global.css:32` (`#9ca3af`) and `global.css:49` (`#374151`) should use `@apply text-gray-400` / `@apply border-slate-700` instead of raw hex.
25. **Magic numbers in `preview.css` and component `<style>` blocks** — `padding: 4px 8px`, `font-size: 12px`, `max-width: 300px`, `background-color: #1e293b8e` etc. across `preview.css` and several component `<style>` blocks. Replace with Tailwind scale values or CSS custom properties.

### Astro / General

26. **No `Props` interface in layouts** — `FrontPageLayout.astro:6`, `PreviewLayout.astro:4` destructure `Astro.props` without a typed `interface Props`.
27. **`window.location.href` bypasses Astro router** — `projects/index.svelte:15` uses direct assignment, bypassing any `<ClientRouter>` view transitions. Use `<a>` tags or Astro's navigation API.
28. **Direct `localStorage` access in `Login.svelte`** — Lines 4, 19, 24, 25 bypass `src/localstorage.ts`. All localStorage access should go through the centralised helper.
29. **Typo: "Summery" → "Summary"** — `project/index.svelte:22,40`.
30. **`.ts`/`.js` extensions in imports** — `AuthGate.svelte:2` imports `'../store.js'`; `projects/index.svelte:3` imports `'./helper.ts'`. Omit extensions in TypeScript/Vite projects.
31. **Unused import in `Colors.svelte`** — `import { get } from 'svelte/store'` is imported but never used.
32. **Hardcoded test project data in `store.ts`** — `store.ts:10` — `{ ...getEmptyProjectStructure(1) }` noted as "remove when done testing" remains committed.
