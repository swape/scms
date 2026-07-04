<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType } from '../../types/types.ts'
import { elementsList } from './elements-list.ts'

function addElement(type: string, name: string) {
  if (!$selectedPage) {
    return
  }

  const project = $currentProject
  if (!project) {
    return
  }

  const existingPageId = $selectedPage.id
  if (existingPageId !== $selectedPage.id) {
    return
  }
  const existingCount = $selectedPage.content?.length ?? 0

  const newElement: ContentType = {
    id: String(Date.now()),
    order: existingCount + 1,
    parent: null,
    pageId: $selectedPage.id,
    title: name,
    type,
    content: '',
  }

  $selectedPage.content = [...($selectedPage.content ?? []), newElement]
  project.pages = project.pages.map((page) => {
    if (page.id === $selectedPage.id) {
      return { ...$selectedPage }
    }
    return page
  })
  currentProject.set(project)
  selectedElement.set(newElement)
}
</script>

{#if $selectedPage}
  <div class="p-5 border-t border-gray-800">
    <p class="text-gray-500 text-sm mb-3">Add element</p>
    <div class="flex flex-wrap gap-2">
      {#each elementsList as el}
        <button class="flex items-center gap-1 px-3 py-1.5 border border-gray-700 rounded hover:border-gray-400 text-sm" onclick={() => addElement(el.type, el.name)}>
          <span class="material-symbols-outlined text-base">{el.icon}</span>
          {el.name}
        </button>
      {/each}
    </div>
  </div>
{/if}
