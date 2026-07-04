<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../../../store.ts'
import type { ContentType, PageType } from '../../../../types/types.ts'

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  selectedElement.update((element) => {
    if (element) {
      ;(element as ContentType).content = textarea.value
    }
    updatePageContentWithDebounce()
    return element
  })
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  selectedElement.update((element) => {
    if (element) {
      element.title = input.value.slice(0, 100)
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

<div class="input-and-label-wrapper">
  <label for="text-title">Title:</label>
  <input id="text-title" type="text" value={$selectedElement?.title || ''} on:input={updateTitle} />
</div>

<div class="input-and-label-wrapper">
  <label for="text-content">Content:</label>
  <textarea id="text-content" rows="6" value={($selectedElement as ContentType)?.content || ''} on:input={updateContent}></textarea>
</div>
