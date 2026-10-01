<script lang="ts">
import { selectedElement } from '../../../../store.ts'
import type { ContentType } from '../../../../types/types.ts'
import TextAlign from '../../stylingParts/TextAlign.svelte'

const { updatePageContentWithDebounce, update } = $props()

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  update('content', textarea.value.trim())
  updatePageContentWithDebounce()
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  update('title', input.value.slice(0, 100))
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
  <label for="text-title">Title:</label>
  <input id="text-title" type="text" value={$selectedElement?.title || ''} oninput={updateTitle} />
</div>

<TextAlign element={$selectedElement} {update} title="Title Alignment" id="title-alignment" styleName="titleAlign" />

<div class="input-and-label-wrapper">
  <label for="text-content">Content:</label>
  <textarea id="text-content" rows="6" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent}></textarea>
</div>

<TextAlign element={$selectedElement} {update} title="Content Alignment" id="content-alignment" styleName="textAlign" />

{#if $selectedElement?.style?.backgroundColor}
  <div class="input-and-label-wrapper">
    <label for="text-border-radius">Border Radius (px):</label>
    <input id="text-border-radius" type="number" min="0" value={getBorderRadius()} oninput={updateBorderRadius} />
  </div>
{/if}
