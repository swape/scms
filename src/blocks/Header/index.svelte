<script lang="ts">
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import Margin from '../shared/Margin.svelte'
import Padding from '../shared/Padding.svelte'
import TextAlign from '../shared/TextAlign.svelte'
import TextAndBackgroundColors from '../shared/TextAndBackgroundColors.svelte'
import Wrapper from '../shared/Wrapper.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

function updateContent(event: Event) {
  const input = event.target as HTMLInputElement
  update('content', input.value)
  updatePageContentWithDebounce()
}

function updateLevel(event: Event) {
  const select = event.target as HTMLSelectElement
  update('headerLevel', select.value)
  updatePageContentWithDebounce()
}

function updateBorderRadius(event: Event) {
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

function getBorderRadius(): string {
  const value = $selectedElement?.style?.borderRadius
  if (value === undefined || value === null || value === '') {
    return '8'
  }
  return String(value)
}
</script>

<div class="input-and-label-wrapper">
  <label for="header-level">Level:</label>
  <select id="header-level" value={($selectedElement as ContentType)?.headerLevel || 'h2'} onchange={updateLevel}>
    <option value="h1">H1</option>
    <option value="h2">H2</option>
    <option value="h3">H3</option>
    <option value="h4">H4</option>
    <option value="h5">H5</option>
    <option value="h6">H6</option>
  </select>
</div>

<div class="input-and-label-wrapper">
  <label for="header-content">Text:</label>
  <input id="header-content" type="text" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent} />
</div>

<TextAlign element={$selectedElement} {update} title="Text Alignment" id="text-alignment" styleName="textAlign" />

{#if $selectedElement?.style?.backgroundColor}
  <div class="input-and-label-wrapper">
    <label for="header-border-radius">Border Radius (px):</label>
    <input id="header-border-radius" type="number" min="0" value={getBorderRadius()} oninput={updateBorderRadius} />
  </div>
{/if}

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>
<Wrapper {updatePageContentWithDebounce} {update} />
<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
<Padding {updatePageContentWithDebounce} {update} />
<Margin {updatePageContentWithDebounce} {update} />
