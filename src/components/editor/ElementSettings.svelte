<script>
import { currentProject, selectedElement } from '../../store'
import BlockText from './elements/BlockText.svelte'
import PageElement from './elements/PageElement.svelte'

let element = $state()
let autoSave = $state(true)

function savePage(localElement) {
  const oldCurrentProject = { ...$currentProject }
  oldCurrentProject.pages[localElement.id] = { ...localElement }
  $currentProject = oldCurrentProject
}

function saveElement(localElement) {
  const oldCurrentProject = { ...$currentProject }
  oldCurrentProject.content[localElement.id] = { ...localElement }
  $currentProject = oldCurrentProject
}

function changeAction(elm) {
  element = elm
  if (autoSave) {
    onSave()
  }
}

function onSave() {
  if (element.type === 'page') {
    savePage(element)
  } else {
    saveElement(element)
  }
}
</script>

<div>
  {#if $selectedElement}
    <small>ID: {$selectedElement.id}</small>
    <small>Type: {$selectedElement.type}</small>

    {#if $selectedElement.type === 'page'}
      <PageElement element={$selectedElement} onChange={changeAction} />
    {/if}
    {#if $selectedElement.type === 'block-text'}
      <BlockText element={$selectedElement} onChange={changeAction} />
    {/if}

    <div class="mt-4 flex gap-3 items-center flex-wrap">
      <button
        type="button"
        class="save-button btn px-4 py-2 active"
        onclick={onSave}
        disabled={autoSave}>Save</button>
      <label><input type="checkbox" bind:checked={autoSave} /> Auto Save</label>
    </div>
  {:else}
    <p>No element selected.</p>
  {/if}
</div>
