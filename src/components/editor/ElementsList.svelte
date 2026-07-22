<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType, LinkSettings } from '../../types/types.ts'
import { elementsList } from './elements-list.ts'

function getDefaultLinkSettings(): LinkSettings {
  const firstPageId = $currentProject?.pages?.[0]?.id || ''
  return {
    text: 'Learn more',
    mode: 'url',
    url: '',
    pageId: firstPageId,
    target: '_self',
    asButton: false,
  }
}

function buildNewElement(type: string, name: string, pageId: string, order: number): ContentType {
  const newElement: ContentType = {
    id: String(Date.now()),
    order,
    parent: null,
    pageId,
    title: name,
    type,
    content: String(type === 'text' || type === 'header' ? 'New text content' : ''),
    style: {
      wrapper: 'container',
      marginBottom: '24',
    },
  }

  if (type === 'link') {
    newElement.link = getDefaultLinkSettings()
  }

  return newElement
}

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
  const newElement = buildNewElement(type, name, $selectedPage.id, existingCount + 1)

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
