<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../../../store.ts'
import type { PageType } from '../../../../types/types.ts'

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  selectedElement.update((element) => {
    if (element) {
      element.title = input.value
    }
    updatePageWithDebounce()
    return element
  })
}

function updateOrder(event: Event) {
  const input = event.target as HTMLInputElement
  selectedElement.update((element) => {
    if (element) {
      element.order = Number.parseInt(input.value, 10) || 0
    }
    updatePageWithDebounce()
    return element
  })
}

// update the project's page with debounced input
let debounceTimeout: ReturnType<typeof setTimeout>

function updatePageWithDebounce() {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    currentProject.update((project) => {
      if (project?.pages && $selectedElement) {
        const pageIndex = project.pages.findIndex((page: PageType) => page.id === $selectedElement.id)
        if (pageIndex !== -1 && $selectedElement.type === 'page') {
          project.pages[pageIndex] = { ...$selectedElement } as PageType
          selectedPage.set($selectedElement as PageType)
        }
      }
      return project
    })
  }, 300)
}

// TODO: add color settings for text and background colors
</script>

<div class="input-and-label-wrapper">
  <label for="title">Title:</label>
  <input id="title" type="text" value={$selectedElement?.title || ''} on:input={updateTitle} />
</div>

<div class="input-and-label-wrapper">
  <label for="order">Order:</label>
  <input id="order" type="text" value={$selectedElement?.order || ''} on:input={updateOrder} />
</div>
