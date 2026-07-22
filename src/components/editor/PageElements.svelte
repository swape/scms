<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType, PageType, ProjectType } from '../../types/types.ts'

let dragIndex: number | null = null

function sortContentByOrder(content: ContentType[]): ContentType[] {
  return [...content].sort((a, b) => (a.order || 0) - (b.order || 0))
}

function normalizeElementOrder(content: ContentType[]): ContentType[] {
  return content.map((element, index) => {
    return {
      ...element,
      order: index + 1,
    }
  })
}

function syncPageContent(updatedContent: ContentType[]) {
  const activePage = $selectedPage
  if (!activePage) {
    return
  }

  const nextPage: PageType = {
    ...activePage,
    content: updatedContent,
  }

  selectedPage.set(nextPage)

  currentProject.update((project) => {
    if (!project) {
      return project
    }

    const nextPages = project.pages.map((page) => {
      if (page.id === nextPage.id) {
        return nextPage
      }
      return page
    })

    const nextProject: ProjectType = {
      ...project,
      pages: nextPages,
    }

    return nextProject
  })

  const activeElement = $selectedElement
  if (activeElement && activeElement.type !== 'page') {
    const matchedElement = updatedContent.find((element) => element.id === activeElement.id)
    if (matchedElement) {
      selectedElement.set(matchedElement)
    }
  }
}

function getSortedPageContent(): ContentType[] {
  const page = $selectedPage
  if (!page || !page.content) {
    return []
  }

  return sortContentByOrder(page.content)
}

function handleDragStart(event: DragEvent, index: number) {
  dragIndex = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(event: DragEvent, dropIndex: number) {
  event.preventDefault()

  if (dragIndex === null || dragIndex === dropIndex) {
    dragIndex = null
    return
  }

  const sortedContent = getSortedPageContent()
  if (dragIndex < 0 || dragIndex >= sortedContent.length || dropIndex < 0 || dropIndex >= sortedContent.length) {
    dragIndex = null
    return
  }

  const reordered = [...sortedContent]
  const [movedElement] = reordered.splice(dragIndex, 1)

  if (!movedElement) {
    dragIndex = null
    return
  }

  reordered.splice(dropIndex, 0, movedElement)
  const normalized = normalizeElementOrder(reordered)
  syncPageContent(normalized)
  dragIndex = null
}

function deleteElementWithConfirmation(elementId: string | number) {
  if (confirm('Are you sure you want to delete this element?')) {
    const sortedContent = getSortedPageContent()
    const filtered = sortedContent.filter((element) => element.id !== elementId)
    const normalized = normalizeElementOrder(filtered)
    syncPageContent(normalized)
    selectedElement.set(null)
  }
}
</script>

<div class="p-5">Page elements</div>

{#if $selectedPage}
  <ul class="p-5">
    {#each getSortedPageContent() as element, index (element.id)}
      <li
        class="flex mb-2 gap-2 justify-between"
        draggable="true"
        ondragstart={(event) => handleDragStart(event, index)}
        ondragover={handleDragOver}
        ondrop={(event) => handleDrop(event, index)}>
        <button type="button" onclick={() => selectedElement.set(element)} class="flex-1 bg-slate-800 p-2 rounded cursor-pointer hover:bg-slate-700">
          <div class="flex gap-2 items-center" data-id={element.id} data-type={element.type} data-order={element.order}>
            <span class="text-xs text-gray-400">({element.order})</span>
            <span class="material-symbols-outlined">{'brick'}</span>
            <span>{element.title || element.type}</span>
          </div>
        </button>
        <button type="button" onclick={() => deleteElementWithConfirmation(element.id)} class=" bg-red-800 p-2 rounded cursor-pointer hover:bg-red-700">
          <span class="material-symbols-outlined">{'delete'}</span>
        </button>
      </li>
    {/each}
  </ul>
{/if}
