<script>
import { currentProject, selectedElement } from '../../store'
import BlockText from './elements/BlockText.svelte'
import PageElement from './elements/PageElement.svelte'

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
  $selectedElement = elm
  if (autoSave) {
    onSave()
  }
}

function onSave() {
  if ($selectedElement.type === 'page') {
    savePage($selectedElement)
  } else {
    saveElement($selectedElement)
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

    <!-- element styles-->
    {#if $selectedElement.styles}
      <div class="forms">
        <label
          ><span>Spacing-top</span>
          <select
            class="select"
            bind:value={$selectedElement.styles.spacingTop}
            onchange={() => changeAction($selectedElement)}>
            <option value="">none</option>
            <option value="pt-4">Small</option>
            <option value="pt-8">Medium</option>
            <option value="pt-16">Large</option>
            <option value="pt-32">Extra Large</option>
          </select>
        </label>
      </div>

      <div class="forms">
        <label
          ><span>Spacing-bottom</span>
          <select
            class="select"
            bind:value={$selectedElement.styles.spacingBottom}
            onchange={() => changeAction($selectedElement)}>
            <option value="">none</option>
            <option value="pb-4">Small</option>
            <option value="pb-8">Medium</option>
            <option value="pb-16">Large</option>
            <option value="pb-32">Extra Large</option>
          </select>
        </label>
      </div>

      <div class="forms">
        <label
          ><span>Block width</span>
          <select
            class="select"
            bind:value={$selectedElement.styles.blockWidth}
            onchange={() => changeAction($selectedElement)}>
            <option value="max-w-full">Full Width</option>
            <option value="max-w-md">Small Width</option>
            <option value="max-w-3xl">Medium Width</option>
            <option value="max-w-xl">Narrow Width</option>
            <option value="">Auto Width</option>
          </select>
        </label>
      </div>

      <div class="forms">
        <label
          ><span>Text Align</span>
          <select
            class="select"
            bind:value={$selectedElement.styles.textAlign}
            onchange={() => changeAction($selectedElement)}>
            <option value="">Left</option>
            <option value="text-center">Center</option>
            <option value="text-right">Right</option>
            <option value="text-justify">Justify</option>
          </select>
        </label>
      </div>

      <div class="forms">
        <label
          ><span>Inline spacing</span>
          <select
            class="select"
            bind:value={$selectedElement.styles.inlineSpacing}
            onchange={() => changeAction($selectedElement)}>
            <option value="">none</option>
            <option value="px-2">Small</option>
            <option value="px-4">Medium</option>
            <option value="px-6">Large</option>
            <option value="px-8">Extra Large</option>
          </select>
        </label>
      </div>
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
