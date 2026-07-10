<script lang="ts">
import { selectedElement } from '../../store.ts'
import Padding from './stylingParts/Padding.svelte'
import TextAndBackgroundColors from './stylingParts/TextAndBackgroundColors.svelte'

const { updatePageContentWithDebounce, update } = $props()

function updateWrapper(event: Event) {
  const select = event.target as HTMLSelectElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, wrapper: select.value })
  updatePageContentWithDebounce()
}
</script>

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>

{#if $selectedElement?.type !== 'page'}
  <div class="input-and-label-wrapper">
    <label for="wrapper-options">Wrapper:</label>
    <select id="wrapper-options" value={($selectedElement?.style?.wrapper as string) || ''} onchange={updateWrapper}>
      <option value="container">Container</option>
      <option value="">None</option>
    </select>
  </div>
{/if}

<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
{#if $selectedElement?.type !== 'page'}
  <Padding {updatePageContentWithDebounce} {update} />
{/if}
