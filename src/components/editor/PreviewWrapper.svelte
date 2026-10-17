<script lang="ts">
import { currentProject, selectedPage } from '../../store.ts'
import type { PageType, ProjectType } from '../../types/types.ts'

let iframePage = $state<string | null>(null)
let projectId = $state<string | number | null>(null)
let pageData = $state<PageType | null>(null)
let projectSettings = $state<Omit<ProjectType, 'pages'> | null>(null)

selectedPage.subscribe((value: PageType | null) => {
  if (value !== null && value !== undefined) {
    iframePage = value.id
    pageData = value
  }
})

currentProject.subscribe((value) => {
  if (value !== null && value !== undefined) {
    projectId = value.id
    const { pages, ...settings } = value
    projectSettings = settings

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
    data: JSON.stringify(pageData) ?? 'null',
    settings: JSON.stringify(projectSettings) ?? 'null',
  })

  return `/preview/?${query.toString()}`
})
</script>

{#if previewUrl}
  <iframe title="Preview" src={previewUrl} class="w-full h-full"></iframe>
{:else}
  <p>Loading preview...</p>
{/if}
