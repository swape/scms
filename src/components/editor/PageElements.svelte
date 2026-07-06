<script lang="ts">
import { selectedElement, selectedPage } from '../../store.ts'

function deleteElementWithConfirmation(elementId: string | number) {
  if (confirm('Are you sure you want to delete this element?')) {
    selectedPage.update((page) => {
      if (page) {
        page.content = page.content?.filter((element) => element.id !== elementId)
      }
      return page
    })
    selectedElement.set(null)
  }
}
</script>

<div class="p-5">Page elements</div>

{#if $selectedPage}
  <ul class="p-5">
    {#each $selectedPage.content as element (element.id)}
      <li class="flex mb-2 gap-2 justify-between">
        <button type="button" onclick={() => selectedElement.set(element)} class="flex-1 bg-slate-800 p-2 rounded cursor-pointer hover:bg-slate-700">
          <div class="flex gap-2 items-center" data-id={element.id} data-type={element.type} data-order={element.order}>
            <span class="material-symbols-outlined">{'brick'}</span>
            <span>{element.title}</span>
          </div>
        </button>
        <button type="button" onclick={() => deleteElementWithConfirmation(element.id)} class=" bg-red-800 p-2 rounded cursor-pointer hover:bg-red-700">
          <span class="material-symbols-outlined">{'delete'}</span>
        </button>
      </li>
    {/each}
  </ul>
{/if}
