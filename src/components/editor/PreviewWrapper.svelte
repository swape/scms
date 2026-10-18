<script lang="ts">
import { currentProject, selectedPage } from '../../store.ts'
import type { PageType, ProjectType } from '../../types/types.ts'

let iframePage = $state<string | null>(null)
let projectId = $state<string | number | null>(null)
let pageData = $state<PageType | null>(null)
let projectSettings = $state<ProjectType | null>(null)
let previewForm: HTMLFormElement | undefined = $state()

selectedPage.subscribe((value: PageType | null) => {
  if (value !== null && value !== undefined) {
    iframePage = value.id
    pageData = value
  }
})

currentProject.subscribe((value) => {
  if (value !== null && value !== undefined) {
    projectId = value.id
    const { pages } = value
    projectSettings = value

    if (iframePage === null) {
      iframePage = pages.length > 0 ? pages[0].id : null
    }
  }
})

const previewUrl = $derived.by(() => {
  if (!pageData || !projectSettings) {
    return null
  }

  const query = new URLSearchParams({
    page: iframePage ?? '',
    project: String(projectId ?? ''),
  })

  return `/preview/?${query.toString()}`
})

const pagePayload = $derived(JSON.stringify(pageData) ?? 'null')
const settingsPayload = $derived(JSON.stringify(projectSettings) ?? 'null')

$effect(() => {
  if (previewForm && previewUrl && pagePayload && settingsPayload) {
    previewForm.requestSubmit()
  }
})
</script>

{#if previewUrl && pagePayload && settingsPayload}
  <form bind:this={previewForm} method="POST" action={previewUrl} target="preview-frame">
    <input type="hidden" name="data" value={pagePayload} />
    <input type="hidden" name="settings" value={settingsPayload} />
  </form>
{/if}

<iframe name="preview-frame" title="Preview" class="w-full h-full"></iframe>
