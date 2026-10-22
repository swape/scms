<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType, PageType } from '../../types/types.ts'
import { getEditorDefinition } from './elements-list.ts'

let toggleFloat = $state(false)
const definition = $derived($selectedElement ? getEditorDefinition($selectedElement.type) : undefined)
const editorModule = $derived(definition?.editor())

// Updating a single key value for the selected element.
function update(key: string, value: unknown) {
  selectedElement.update((element) => {
    if (element) {
      // @ts-expect-error update the property dynamically
      ;(element as ContentType)[key] = value
    }
    updatePageContentWithDebounce()
    return element
  })
}

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

<div class={`p-5 settings bg-slate-900 ${toggleFloat ? 'float' : ''}`}>
  {#if $selectedElement}
    <div>
      <button title="Toggle width" class="btn flex p-2 rounded-full mb-4" onclick={() => (toggleFloat = !toggleFloat)}
        ><span class="material-symbols-outlined">{!toggleFloat ? 'chevron_left' : 'chevron_right'}</span></button>
    </div>
    <div class="mb-4 pb-2 border-b border-gray-800">
      <div class="flex gap-2 items-center">
        <span class="text-gray-500 min-w-15 inline-block">Type:</span> <span class="material-symbols-outlined">{$selectedElement.type === 'page' ? 'draft' : 'brick'}</span>
        {$selectedElement.type}
      </div>
      <div><span class="text-gray-500 min-w-15 inline-block">Title:</span> {$selectedElement.title}</div>
      <small class="text-gray-500"><span class="min-w-15 inline-block">ID:</span> {$selectedElement.id}</small>
    </div>
    {#if editorModule}
      {#await editorModule}
        <p role="status">Loading block editor...</p>
      {:then module}
        <module.default {updatePageContentWithDebounce} {update} />
      {:catch error}
        <p role="alert">Could not load block editor: {error instanceof Error ? error.message : String(error)}</p>
      {/await}
    {:else}
      <p role="alert">No editor registered for block type: {$selectedElement.type}</p>
    {/if}
  {/if}
</div>

<style>
.settings {
  max-height: 100svh;
  overflow-y: auto;
}

.float {
  position: fixed;
  right: 0;
  width: 60%;
  bottom: 0;
  top: 150px;
  overflow-y: auto;
}
</style>
