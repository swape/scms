<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType, PageType } from '../../types/types.ts'
import LinkElementEdit from './elements/Link/index.svelte'
import PageElementEdit from './elements/Page/index.svelte'
import TextElementEdit from './elements/Text/index.svelte'

let debounceTimeout: ReturnType<typeof setTimeout>

function updatePageContentWithDebounce() {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    const project = $currentProject
    const page = $selectedPage
    const element = $selectedElement

    if (project && page && element) {
      const currentPageId = page.id
      const currentElementId = element.id
      if (currentPageId && currentElementId) {
        const updatedPages = project.pages.map((p: PageType) => {
          if (p.id === currentPageId) {
            const updatedContent = p.content?.map((c: ContentType) => {
              if (c.id === currentElementId) {
                return { ...(element as ContentType) }
              }
              return c
            })
            return { ...p, content: updatedContent }
          }
          return p
        })
        currentProject.set({ ...project, pages: updatedPages })
        selectedPage.set({ ...page, content: updatedPages.find((p) => p.id === currentPageId)?.content ?? [] })
      }
    }
  }, 300)
}
</script>

<div class="p-5 settings">
  {#if $selectedElement}
    <div class="mb-4 pb-2 border-b border-gray-800">
      <div class="flex gap-2 items-center">
        <span class="text-gray-500 min-w-15 inline-block">Type:</span> <span class="material-symbols-outlined">{$selectedElement.type === 'page' ? 'draft' : 'brick'}</span>
        {$selectedElement.type}
      </div>
      <div><span class="text-gray-500 min-w-15 inline-block">Title:</span> {$selectedElement.title}</div>
      <small class="text-gray-500"><span class="min-w-15 inline-block">ID:</span> {$selectedElement.id}</small>
    </div>
    {#if $selectedElement.type === 'page'}
      <PageElementEdit />
    {:else if $selectedElement.type === 'text'}
      <TextElementEdit {updatePageContentWithDebounce} />
    {:else if $selectedElement.type === 'link'}
      <LinkElementEdit {updatePageContentWithDebounce} />
    {/if}
  {/if}
</div>
