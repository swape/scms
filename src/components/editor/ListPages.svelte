<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { PageType } from '../../types/types.ts'
import ListPagesContent from './ListPagesContent.svelte'

const { pages, addPage } = $props()
let showSubMenu = $state()

function select(page: PageType) {
  selectedPage.set(page)
  selectedElement.set(page)
}

function addSubPage(pageId: string) {
  const project = $currentProject
  addPage(pageId, (project?.pages?.filter((p) => p.parentId === pageId).length || 0) + 1)
  showSubMenu = null
}

function deletePageWithSubPagesAndConfirm(page: PageType) {
  const confirmDelete = confirm(`Are you sure you want to delete the page "${page.title}" and all its subpages? This action cannot be undone.`)
  if (confirmDelete) {
    deletePageWithSubPages(page)
  }
}

function deletePageWithSubPages(page: PageType) {
  const project = $currentProject
  if (project) {
    // Remove the page and its sub-pages recursively from the project's pages array
    const removePageAndSubPages = (pageId: string) => {
      const index = project.pages.findIndex((p) => p.id === pageId)
      if (index !== -1) {
        const subPages = project.pages.filter((p) => p.parentId === pageId)
        subPages.forEach((subPage) => removePageAndSubPages(subPage.id))
        project.pages.splice(index, 1)
      }
    }
    removePageAndSubPages(page.id)

    currentProject.set(project)

    // If the deleted page was the selected page, clear the selection
    if ($selectedPage?.id === page.id) {
      selectedPage.set(null)
      selectedElement.set(null)
    }
  }
}

function toggleSubMenuFor(pageId: string) {
  showSubMenu = showSubMenu === pageId ? null : pageId
}
</script>

<div>
  <ul class="p-5">
    <ListPagesContent parentId={null} {pages} {select} {addSubPage} {deletePageWithSubPagesAndConfirm} {toggleSubMenuFor} {showSubMenu} />
  </ul>
</div>
