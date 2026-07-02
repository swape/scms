<script lang="ts">
import { selectedPage } from '../../store.ts'

const { pages, select, addSubPage, deletePageWithSubPagesAndConfirm, toggleSubMenuFor, showSubMenu } = $props()
</script>

{#each pages as page}
  <li class="flex justify-between gap-2 relative pb-2">
    <button onclick={() => select(page)} class={`${$selectedPage?.id === page.id ? 'active' : ''} page-button`}
      ><span class="material-symbols-outlined">draft</span>{page.title}</button>
    <button class={`${showSubMenu === page.id ? 'active' : ''} submenu-button`} onclick={() => toggleSubMenuFor(page.id)}
      ><span class="material-symbols-outlined">more_vert</span></button>
    <div class={`${showSubMenu === page.id ? '' : 'hidden'} submenu`}>
      <button onclick={() => addSubPage(page.id)}><span class="material-symbols-outlined">add</span> Add Subpage</button>
      <button onclick={() => deletePageWithSubPagesAndConfirm(page)}><span class="material-symbols-outlined">delete</span> Delete</button>
    </div>
  </li>
{/each}

<style>
.page-button {
  background: none;
  border: none;
  padding: 5px;
  flex: 1;
  gap: 5px;
  display: flex;
  align-items: center;

  &.active {
    background-color: #333;
    color: white;
    padding-inline-start: 10px;
    border-radius: 5px 0 0 5px;
  }
}

.submenu {
  position: absolute;
  background-color: white;
  padding: 5px;
  z-index: 1000;
  display: flex;
  color: black;
  flex-direction: column;
  top: 30px;
  width: 100%;
  border-radius: 5px 0 5px 5px;
  align-items: flex-start;

  &.hidden {
    display: none;
  }

  > button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 5px;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 5px;

    &:hover {
      background-color: #eee;
    }
  }
}
.submenu-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  border-radius: 5px;

  &.active {
    border-radius: 5px 5px 0 0;
    background-color: white;
    color: black;
  }
}
</style>
