## 2026-03-25 — Fix #18: Store subscriptions at module level (memory leaks)

Files changed:

- `src/components/editor/PageListItem.svelte` — replaced `currentProject.subscribe()` with `$derived()` using `$currentProject` auto-subscription
- `src/components/editor/index.svelte` — replaced two `.subscribe()` calls with `$effect()` blocks using `$projects` and `$selectedElement`
- `src/components/pageBuilderWrapper/index.svelte` — moved `window.addEventListener('storage', …)` inside `$effect()` with cleanup return; replaced `selectedElement.subscribe()` with `$effect()`; added `lang="ts"` to script tag
- `src/components/project/Colors.svelte` — replaced `projects.subscribe()` with `$effect()`; removed unused `import { get } from 'svelte/store'`
- `src/components/project/Edit.svelte` — replaced `projects.subscribe()` with `$effect()`
- `src/components/project/index.svelte` — replaced `projects.subscribe()` with `$effect()`

All bare `.subscribe()` calls were unmanaged (no unsubscribe), causing memory leaks on component teardown. Replaced with Svelte 5 `$effect()` (auto-cleanup) or `$derived()` where the value is purely computed.
