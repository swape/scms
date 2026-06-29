<script lang="ts">
import { currentProject } from '../../store'
import { getPagesAsArray } from '../editor/helper'
import PageListItemSub from './PageListItem.svelte'

let { page, handlePageAdd, handlePageClick } = $props()
let localSubPages = $derived($currentProject ? getPagesAsArray($currentProject.pages || {}, page.id || null) : [])
let isOpen = $state(false)

function handleAddPageAndOpenSubPages(id: string | null = null) {
  handlePageAdd(id)
  isOpen = true
}
</script>

<div>
  <div class="page-list-row page-link">
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
        <PageListItemSub page={subPage} {handlePageAdd} {handlePageClick} />
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
  button:has(.material-symbols-outlined):last-of-type {
    color: rgba(0, 200, 20, 0.7);
    background-color: rgba(0, 200, 20, 0.2);

    &:hover {
      background-color: rgba(108, 251, 122, 0.829);
      color: black;
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
