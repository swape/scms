<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType, PageType, ProjectType } from '../../types/types.ts'
import Button from '../Button.svelte'
import Icon from '../Icon.svelte'
import PanelSection from '../PanelSection.svelte'
import { getElementDefinition } from './elements-list.ts'

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

<PanelSection title="Layers">
  {#if $selectedPage}
    <ul class="layer-list" aria-label="Page elements">
      {#each getSortedPageContent() as element, index (element.id)}
        <li class="layer-row" draggable="true" ondragstart={(event) => handleDragStart(event, index)} ondragover={handleDragOver} ondrop={(event) => handleDrop(event, index)}>
          <Button
            variant="ghost"
            active={$selectedElement?.id === element.id}
            aria-pressed={$selectedElement?.id === element.id}
            onclick={() => selectedElement.set(element)}
            class="layer-button">
            <span class="layer-content" data-id={element.id} data-type={element.type} data-order={element.order}>
              <Icon name={getElementDefinition(element.type)?.icon ?? 'crop_square'} />
              <span class="layer-name">{element.title || element.type}</span>
            </span>
          </Button>
          <Button
            variant="ghost"
            icon="delete"
            iconOnly
            aria-label={`Delete ${element.title || element.type}`}
            title="Delete element"
            onclick={() => deleteElementWithConfirmation(element.id)} />
        </li>
      {:else}
        <li class="layer-empty">Add a block to start building this page.</li>
      {/each}
    </ul>
  {/if}
</PanelSection>

<style>
.layer-row {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.layer-row :global(.layer-button) {
  flex: 1;
  min-width: 0;
  justify-content: flex-start;
}
.layer-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.layer-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.layer-empty {
  color: var(--ui-muted);
  padding: 0.25rem 0;
}
</style>
