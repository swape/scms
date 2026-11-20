<script lang="ts">
import { selectedPage } from '../../store.ts'
import { addElement } from '../../utils/elements.ts'
import Button from '../Button.svelte'
import PanelSection from '../PanelSection.svelte'
import { elementsList } from './elements-list.ts'
</script>

{#if $selectedPage}
  <PanelSection title="Add element">
    <div class="block-library">
      {#each elementsList as el}
        <Button icon={el.icon} title={`Add ${el.name}`} onclick={() => addElement(el.type, el.name)}>{el.name}</Button>
      {/each}
    </div>
  </PanelSection>
{/if}

<style>
.block-library {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.375rem;
}

.block-library :global(button) {
  justify-content: flex-start;
}
</style>
