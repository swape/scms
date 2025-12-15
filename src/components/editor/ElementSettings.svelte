<script>
import { selectedElement, currentProject } from '../../store'
import BlockText from './elements/BlockText.svelte'
import PageElement from './elements/PageElement.svelte'

// TODO: handle different element types and their specific settings
// TODO: add changed settings to the currentProject store
</script>

<div>
  {#if $selectedElement}
    <small>ID: {$selectedElement.id}</small>
    <small>Type: {$selectedElement.type}</small>

    {#if $selectedElement.type === 'page'}
      <PageElement element={$selectedElement} />
    {/if}
    {#if $selectedElement.type === 'block-text'}
      <BlockText element={$selectedElement} />
    {/if}
  {:else}
    <p>No element selected.</p>
  {/if}
</div>
