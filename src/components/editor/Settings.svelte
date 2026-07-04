<script lang="ts">
import { selectedElement } from '../../store.ts'
import PageElementEdit from './elements/Page/index.svelte'
import TextElementEdit from './elements/Text/index.svelte'
</script>

<div class="p-5 settings">
  {#if $selectedElement}
    <div class="mb-4 pb-2 border-b border-gray-800">
      <div class="flex gap-2 items-center">
        <span class="text-gray-500 min-w-15 inline-block">Type:</span> <span class="material-symbols-outlined">{$selectedElement.type === 'page' ? 'draft' : 'brick'}</span>
        {$selectedElement.type}
      </div>
      <div><span class="text-gray-500 min-w-15 inline-block">Title:</span> {$selectedElement.title}</div>
      <small class="text-gray-500"><span class="min-w-15 inline-block">ID:</span> {$selectedElement.id}</small>
    </div>
    {#if $selectedElement.type === 'page'}
      <PageElementEdit />
    {:else if $selectedElement.type === 'text'}
      <TextElementEdit />
    {/if}
  {/if}
</div>
