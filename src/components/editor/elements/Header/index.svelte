<script lang="ts">
import { selectedElement } from '../../../../store.ts'
import type { ContentType } from '../../../../types/types.ts'
import TextAlign from '../../stylingParts/TextAlign.svelte'

const { updatePageContentWithDebounce, update } = $props()

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
