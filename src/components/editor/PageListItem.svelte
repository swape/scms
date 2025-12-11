<script>
import { currentProject } from '../../store'
import { getPagesAsArray } from '../editor/helper'
import PageListItemSub from './PageListItem.svelte'

let { page, handlePageAdd, handlePageClick } = $props()
let localSubPages = $state()
let isOpen = $state(false)

currentProject.subscribe((value) => {
  if (value) {
    localSubPages = getPagesAsArray(value.pages || {}, page.id || null)
  }
})

function handleAddPageAndOpenSubPages(id) {
  handlePageAdd(id)
  isOpen = true
}
</script>

<div>
  <div class="page-link">
    <button type="button" class="cursor-pointer page-link-item" onclick={() => handlePageClick(page.id)}><small class="mr-2 text-gray-500">{page.order}</small>{page.title}</button>
    <span class="flex gap-1">
      {#if localSubPages.length > 0}
        <button type="button" class="cursor-pointer" onclick={() => (isOpen = !isOpen)}>
          <span class="material-symbols-outlined">
            {#if isOpen}
              expand_more
            {:else}
              chevron_right
            {/if}
          </span>
        </button>
      {/if}
      <button type="button" class="cursor-pointer" onclick={() => handleAddPageAndOpenSubPages(page.id)}><span class="material-symbols-outlined"> add </span></button>
    </span>
  </div>
  {#if localSubPages.length > 0 && isOpen}
    <div class="sub-page">
      {#each localSubPages as subPage}
        <PageListItemSub page={subPage} handlePageAdd={handlePageAdd} handlePageClick={handlePageClick} />
      {/each}
    </div>
  {/if}
</div>

<style>
.sub-page {
  margin-left: 16px;
  border-left: 1px solid rgba(200, 200, 200, 0.2);
  margin-block: 4px 8px;

  &:hover {
    border-left: 1px solid rgba(200, 200, 250, 0.4);
  }
}

.page-link {
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

    &:last-of-type {
      color: rgba(0, 200, 20, 0.7);
      background-color: rgba(0, 200, 20, 0.2);

      &:hover {
        background-color: rgba(108, 251, 122, 0.829);
        color: black;
      }
    }
  }

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
}
</style>
