<script lang="ts">
import { selectedElement } from '../../store.ts'
import PageElementEdit from './elements/Page/index.svelte'

selectedElement.subscribe((value) => {
  console.log('selectedElement', value)
})
</script>

<div class="p-5 settings">
  {#if $selectedElement}
    <div class="mb-4 pb-2 border-b border-gray-800">
      <div><span class="text-gray-500 min-w-15 inline-block">Type:</span> {$selectedElement.type}</div>
      <div><span class="text-gray-500 min-w-15 inline-block">Title:</span> {$selectedElement.title}</div>
      <small class="text-gray-500"><span class="min-w-15 inline-block">ID:</span> {$selectedElement.id}</small>
    </div>
    {#if $selectedElement.type === 'page'}
      <PageElementEdit />
    {/if}
  {/if}
</div>
