<script lang="ts">
import { currentProject, isDarkMode, selectedPage } from '../../store.ts'

let path = $state()

function toggleDarkMode() {
  isDarkMode.update((value) => !value)
}

function findParentTitle(pageId: string | null): string {
  if (!pageId || !$currentProject) {
    return ''
  }
  const project = $currentProject
  const page = project.pages.find((p) => p.id === pageId)
  if (!page) {
    return ''
  }

  return `${findParentTitle(page.parentId)}${page.title} / `
}

selectedPage.subscribe((page) => {
  if (page) {
    const pagePath = findParentTitle(page.id)
    path = pagePath
  } else {
    path = ''
  }
})
</script>

<div class="flex gap-2 p-5 border-b border-gray-600 items-center justify-between">
  <div>
    {$currentProject?.title || 'No project selected'}
  </div>

  <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[50vw]">
    {#if $selectedPage}
      <span class="text-gray-400">{path}</span>
    {:else}
      <span class="text-gray-400">No page selected</span>
    {/if}
  </div>

  <button class="flex items-center gap-1 btn hover:bg-slate-600 px-5 py-4" onclick={toggleDarkMode}>
    <span class="material-symbols-outlined">dark_mode</span>
    <span>Toggle Dark Mode</span>
  </button>

  <button class="flex items-center gap-1 btn hover:bg-slate-600 px-5 py-4" onclick={() => alert('Save functionality not implemented yet')}>
    <span class="material-symbols-outlined">save</span>
    <span>Save and Publish</span>
  </button>
</div>
