<script>
import { currentProject } from '../../../store'

let { element } = $props()
let localElement = $derived(structuredClone(element))

function onSave() {
  const oldCurrentProject = { ...$currentProject }
  oldCurrentProject.content[localElement.id] = { ...localElement }
  $currentProject = oldCurrentProject
}
</script>

<div class="forms">
  <label>
    <span>Content:</span>
    <input type="text" bind:value={localElement.content} />
  </label>

  <label>
    <span>Order:</span>
    <input type="number" bind:value={localElement.order} />
  </label>

  <div class="mt-4">
    <button type="button" class="save-button btn px-4 py-2 active" onclick={onSave}>Save</button>
  </div>
</div>
