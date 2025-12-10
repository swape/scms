<script>
import { currentProject, selectedElement } from '../../store'

function handlePageClick(id) {
  $selectedElement = $currentProject.pages[id] || null
}

function handlePageAdd(id = null) {
  const newPage = { id: Date.now(), title: 'new page', type: 'page', parent: id, order: 0 }
  const oldCurrentProject = { ...$currentProject }
  oldCurrentProject.pages[newPage.id] = newPage
  $currentProject = oldCurrentProject
  $selectedElement = newPage
}

function getPagesAsArray(pagesObj, parentId = null) {
  const pages = Object.values(pagesObj || {})
  return pages.filter((p) => p?.parent === parentId)
}
</script>

<div>
  {#each getPagesAsArray($currentProject?.pages || {}) as page}
    <div class="page-link">
      <button type="button" class="cursor-pointer page-link-item" onclick={() => handlePageClick(page.id)}>{page.title}</button>
      <button type="button" class="cursor-pointer" onclick={() => handlePageAdd(page.id)}><span class="material-symbols-outlined"> add </span></button>
    </div>
    {#if getPagesAsArray($currentProject?.pages || {}, page.id).length > 0}
      {#each getPagesAsArray($currentProject?.pages, page.id) as subPage}
        <div class="page-link" style="margin-left: 20px;">
          <button type="button" class="cursor-pointer page-link-item" onclick={() => handlePageClick(subPage.id)}>{subPage.title}</button>
          <button type="button" class="cursor-pointer" onclick={() => handlePageAdd(subPage.id)}><span class="material-symbols-outlined"> add </span></button>
        </div>
        <!-- TODO make this recursive -->
      {/each}
    {/if}
  {/each}
  <div class="page-link mt-2">
    <span class="new-page-item">Add new page</span>
    <button type="button" class="cursor-pointer" onclick={() => handlePageAdd(null)}><span class="material-symbols-outlined"> add </span></button>
  </div>
</div>

<style>
.page-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
  padding: 6px;
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 0 30px 30px 0;

  .page-link-item {
    flex-grow: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  .new-page-item {
    color: rgba(255, 255, 255, 0.6);
    padding-left: 4px;
  }

  button:has(.material-symbols-outlined) {
    background-color: rgba(100, 100, 30, 0.8);
    padding: 4px;
    border-radius: 20px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: rgba(150, 150, 50, 0.8);
    }
  }
}
</style>
