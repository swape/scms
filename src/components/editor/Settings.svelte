<script lang="ts">
import { selectedElement } from '../../store.ts'

selectedElement.subscribe((value) => {
  console.log('selectedElement', value)
})
</script>

<div class="p-5">
  {#if $selectedElement}
    <div>{$selectedElement.type}</div>
    <div>{$selectedElement.title}</div>
    <div>{$selectedElement.id}</div>
  {/if}
</div>
