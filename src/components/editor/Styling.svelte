<script lang="ts">
import { selectedElement } from '../../store.ts'
import Margin from './stylingParts/Margin.svelte'
import Padding from './stylingParts/Padding.svelte'
import TextAndBackgroundColors from './stylingParts/TextAndBackgroundColors.svelte'

const { updatePageContentWithDebounce, update } = $props()

function updateWrapper(event: Event) {
  const select = event.target as HTMLSelectElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, wrapper: select.value })
  updatePageContentWithDebounce()
}

function updateSplitBorderRadius(event: Event) {
  const input = event.target as HTMLInputElement
  const style = $selectedElement?.style || {}
  const nextStyle: Record<string, string | number> = { ...style }

  if (!input.value.trim()) {
    delete nextStyle['borderRadius']
  } else {
    nextStyle['borderRadius'] = Number(input.value)
  }

  update('style', nextStyle)
  updatePageContentWithDebounce()
}

function getSplitBorderRadius(): string {
  const value = $selectedElement?.style?.borderRadius
  if (value === undefined || value === null || value === '') {
    return '8'
  }
  return String(value)
}
</script>

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>

{#if $selectedElement?.type !== 'page'}
  <div class="input-and-label-wrapper">
    <label for="wrapper-options">Wrapper:</label>
    <select id="wrapper-options" value={($selectedElement?.style?.wrapper as string) || ''} onchange={updateWrapper}>
      <option value="container">Container</option>
      {#if $selectedElement?.type === 'image'}
        <option value="center">Center</option>
      {/if}
      <option value="">None</option>
    </select>
  </div>

  {#if $selectedElement?.type === 'splitBlock'}
    <div class="input-and-label-wrapper">
      <label for="split-border-radius">Border radius (px):</label>
      <input id="split-border-radius" type="number" min="0" value={getSplitBorderRadius()} oninput={updateSplitBorderRadius} />
    </div>
  {/if}
{/if}

<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
{#if $selectedElement?.type !== 'page'}
  <Padding {updatePageContentWithDebounce} {update} />
  <Margin {updatePageContentWithDebounce} {update} />
{/if}
