<script>
import { currentProject, selectedElement } from '../../store'
import { getPagesAsArray } from '../editor/helper'
import PageListItem from './PageListItem.svelte'

function handlePageClick(id) {
  $selectedElement = $currentProject.pages[id] || null
}

function handlePageAdd(id = null) {
  const newPage = {
    id: Date.now(),
    title: 'new page',
    type: 'page',
    colors: {
      textColorKey: 'text_1',
      backgroundColorKey: 'bg_1',
    },
    parent: id,
    order: $currentProject
      ? Object.values($currentProject.pages).filter((p) => p.parent === id)
          .length + 1
      : 1,
  }
  const oldCurrentProject = { ...$currentProject }
  oldCurrentProject.pages[newPage.id] = newPage
  $currentProject = oldCurrentProject
  $selectedElement = newPage
}
</script>

{#if $currentProject?.id}
  <div>
    {#each getPagesAsArray($currentProject?.pages || {}) as page}
      <PageListItem {page} {handlePageAdd} {handlePageClick} />
    {/each}
    <div class="mt-2 new-page">
      <span class="new-page-item">Add new page</span>
      <button
        type="button"
        class="cursor-pointer"
        onclick={() => handlePageAdd(null)}
        ><span class="material-symbols-outlined"> add </span></button>
    </div>
  </div>
{/if}

<style>
.new-page {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
  padding: 6px;
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 0 30px 30px 0;

  button:has(.material-symbols-outlined) {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    color: rgba(0, 200, 20, 0.7);
    background-color: rgba(0, 200, 20, 0.2);

    &:hover {
      background-color: rgba(126, 134, 243, 0.829);
      color: black;
    }
  }

  .new-page-item {
    flex-grow: 1;
  }
}
</style>
