<script lang="ts">
import { currentProject, isDarkMode, selectedPage } from '../../store.ts'

let path = $state('')

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
  path = page ? findParentTitle(page.id) : ''
})
</script>

<div class="flex gap-2 p-5 border-b border-gray-600 items-center justify-between">
  <div class="flex gap-2 items-center">
    <div>
      {$currentProject?.title || 'No project selected'}
    </div>

    <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[50vw]">
      {#if $selectedPage}
        <span class="text-gray-400">{path}</span>
      {/if}
    </div>
  </div>
  <button class="top-menu-button btn" onclick={toggleDarkMode}>
    <span class="material-symbols-outlined">dark_mode</span>
    <span>Toggle Dark Mode</span>
  </button>

  <div class="flex gap-2">
    <button class="top-menu-button btn" onclick={() => alert('Save functionality not implemented yet')}>
      <span class="material-symbols-outlined">save</span>
      <span>Save</span>
    </button>

    <button class="top-menu-button btn" onclick={() => alert('Save functionality not implemented yet')}>
      <span class="material-symbols-outlined">save</span>
      <span>Save and Publish</span>
    </button>
  </div>
</div>
