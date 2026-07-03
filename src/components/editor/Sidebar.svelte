<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import { getProjectById } from '../projects/helper.ts'
import ListPages from './ListPages.svelte'

currentProject.subscribe(async (value) => {
  if (!value) {
    const projectId = window.location.search.split('=')[1] || ''
    const project = await getProjectById(projectId)
    currentProject.set(project)

    if (project && !$selectedPage) {
      const page = project.pages[0] || null
      selectedPage.set(page)
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

<aside class="overflow-auto max-h-[96svh]">
  {#if $currentProject}
    <div class="p-5">
      <button onclick={() => addPage()} class="flex items-center gap-1"><span class="material-symbols-outlined"> note_add </span> Add Page</button>
    </div>
    <ListPages pages={$currentProject.pages} {addPage} />
  {/if}
</aside>
