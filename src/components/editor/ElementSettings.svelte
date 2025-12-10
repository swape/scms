<script>
import { selectedElement, currentProject } from '../../store'

// TODO: handle different element types and their specific settings
// TODO: add changed settings to the currentProject store
</script>

<div>
  {#if $selectedElement}
    <h2>Element Settings</h2>
    <small>ID: {$selectedElement.id}</small>
    <div>
      <strong>Title:</strong>
      <input type="text" bind:value={$selectedElement.title} />
    </div>
    <div>
      <strong>Type:</strong>
      {$selectedElement.type}
    </div>
  {:else}
    <p>No element selected.</p>
  {/if}
</div>
