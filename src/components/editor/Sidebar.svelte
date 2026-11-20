<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import { getProjectById, getProjectFromLocalStorage } from '../../utils/projects.ts'
import Button from '../Button.svelte'
import Icon from '../Icon.svelte'
import PanelSection from '../PanelSection.svelte'
import ElementsList from './ElementsList.svelte'
import ListPages from './ListPages.svelte'
import PageElements from './PageElements.svelte'

currentProject.subscribe(async (value) => {
  if (!value) {
    const projectId = URLSearchParams ? new URLSearchParams(window.location.search).get('p') : null
    const localProject = getProjectFromLocalStorage()
    const isLocal = URLSearchParams ? new URLSearchParams(window.location.search).get('local') === 'true' : false
    if (projectId) {
      const project = isLocal && localProject ? localProject : await getProjectById(projectId)
      currentProject.set(project)

      if (project && !$selectedPage) {
        const page = project.pages[0] || null
        selectedPage.set(page)
      }
    }
  }
})

function addPage(parentId: string | null = null, order: number = 0) {
  const project = $currentProject

  if (project) {
    const newOrder = order || (project.pages?.length || 0) + 1
    const newPage = {
      id: String(Date.now()),
      title: `New Page ${newOrder}`,
      content: [],
      parentId,
      type: 'page',
      order: newOrder,
    }

    if (project.pages) {
      project.pages.push(newPage)
    } else {
      project.pages = [newPage]
    }

    currentProject.set(project)
    selectedPage.set(newPage)
    selectedElement.set(newPage)
  }
}
</script>

<aside class="project-items editor-panel" aria-label="Project navigation">
  {#if $currentProject}
    <div class="sidebar-heading">
      <span class="project-mark"><Icon name="dashboard" size={18} /></span>
      <div class="project-identity">
        <strong>{$currentProject.title}</strong>
        <span>Pages and layers</span>
      </div>
    </div>
    <PanelSection title="Pages">
      {#snippet actions()}
        <Button icon="add" iconOnly variant="ghost" aria-label="Add Page" title="Add Page" onclick={() => addPage()} />
      {/snippet}
      <ListPages pages={$currentProject.pages} {addPage} />
    </PanelSection>
    <ElementsList />
    <PageElements />
  {:else}
    <p class="panel-empty">Open a project to edit its pages.</p>
  {/if}
</aside>

<style>
.project-items {
  overflow-y: auto;
}

.project-items :global(.ui-panel-section) {
  margin: 0;
  padding: 12px;
}

.sidebar-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--ui-border);
}

.project-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--ui-selection);
  color: #8acfff;
}

.project-identity {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.project-identity strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
}

.project-identity > span {
  color: var(--ui-muted);
  font-size: 11px;
}
</style>
