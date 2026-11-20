<script lang="ts">
import { selectedPage } from '../../store.ts'
import type { PageType } from '../../types/types.ts'
import Button from '../Button.svelte'
import ListSubPages from './ListPagesContent.svelte'

const { pages, select, addSubPage, deletePageWithSubPagesAndConfirm, toggleSubMenuFor, showSubMenu, parentId } = $props()

// TODO: add drag and drop to reorder pages
function filterPagesByParentId(parentId: string | null): PageType[] {
  return pages.filter((page: PageType) => page.parentId === parentId).sort((a: PageType, b: PageType) => (a.order || 0) - (b.order || 0))
}
</script>

{#each filterPagesByParentId(parentId) as page}
  <li class="page-item">
    <div class="page-row">
      <Button variant="ghost" icon="draft" active={$selectedPage?.id === page.id} aria-pressed={$selectedPage?.id === page.id} onclick={() => select(page)} class="page-button">
        <span class="page-name">{page.title}</span>
      </Button>
      <Button
        variant="ghost"
        icon="more_horiz"
        iconOnly
        class="submenu-button"
        active={showSubMenu === page.id}
        aria-label={`Page actions for ${page.title}`}
        title="Page actions"
        aria-expanded={showSubMenu === page.id}
        onclick={() => toggleSubMenuFor(page.id)} />
      <div class={`${showSubMenu === page.id ? '' : 'hidden'} submenu`}>
        <Button variant="ghost" icon="add" fullWidth onclick={() => addSubPage(page.id)}>Add Subpage</Button>
        <Button variant="danger" icon="delete" fullWidth onclick={() => deletePageWithSubPagesAndConfirm(page)}>Delete</Button>
      </div>
    </div>
    {#if filterPagesByParentId(page.id).length > 0}
      <ul class="page-children">
        <ListSubPages parentId={page.id} {pages} {select} {addSubPage} {deletePageWithSubPagesAndConfirm} {toggleSubMenuFor} {showSubMenu} />
      </ul>
    {/if}
  </li>
{/each}

<style>
.page-item {
  position: relative;
}
.page-row {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  position: relative;
}
.page-row :global(.page-button) {
  flex: 1;
  min-width: 0;
  justify-content: flex-start;
}
.page-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.page-children {
  margin-left: 0.75rem;
  border-left: 0.0625rem solid var(--ui-border);
  padding-left: 0.375rem;
}
.submenu {
  position: absolute;
  top: 2.125rem;
  right: 0;
  z-index: 5;
  width: 11.25rem;
  padding: 0.25rem;
  display: grid;
  gap: 0.125rem;
  background: var(--ui-panel-raised);
  border: 0.0625rem solid var(--ui-border);
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1.5rem #0005;
}
.submenu.hidden {
  display: none;
}
.submenu :global(button) {
  justify-content: flex-start;
}
</style>
