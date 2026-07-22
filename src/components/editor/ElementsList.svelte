<script lang="ts">
import { selectedPage } from '../../store.ts'
import { addElement } from '../../utils/elements.ts'
import { elementsList } from './elements-list.ts'
</script>

{#if $selectedPage}
  <div class="p-5 border-t border-gray-800">
    <p class="text-gray-500 text-sm mb-3">Add element</p>
    <div class="flex flex-wrap gap-2">
      {#each elementsList as el}
        <button class="flex items-center gap-1 px-3 py-1.5 border border-gray-700 rounded hover:border-gray-400 text-sm" onclick={() => addElement(el.type, el.name)}>
          <span class="material-symbols-outlined text-base">{el.icon}</span>
          {el.name}
        </button>
      {/each}
    </div>
  </div>
{/if}
