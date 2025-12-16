<script>
import { currentProject } from '../../../store'
// TODO: this should be dynamic based on element type

let { element } = $props()
let localElement = $derived(structuredClone(element))

function onSave() {
  const oldCurrentProject = { ...$currentProject }
  oldCurrentProject.pages[localElement.id] = { ...localElement }
  $currentProject = oldCurrentProject
}
</script>

<div class="forms">
  <label>
    <span>Title:</span>
    <input type="text" bind:value={localElement.title} />
  </label>

  <label>
    <span>Order:</span>
    <input type="number" bind:value={localElement.order} />
  </label>

  <div class="mt-4">
    <button type="button" class="save-button btn px-4 py-2 active" onclick={onSave}>Save</button>
  </div>
</div>
