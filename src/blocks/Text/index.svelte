<script lang="ts">
import Input from '../../components/Input.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import Margin from '../shared/Margin.svelte'
import Padding from '../shared/Padding.svelte'
import TextAlign from '../shared/TextAlign.svelte'
import TextAndBackgroundColors from '../shared/TextAndBackgroundColors.svelte'
import Wrapper from '../shared/Wrapper.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

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

<Input id="text-title" label="Title:" value={$selectedElement?.title || ''} oninput={updateTitle} />

<TextAlign element={$selectedElement} {update} title="Title Alignment" id="title-alignment" styleName="titleAlign" />

<div class="input-and-label-wrapper">
  <label for="text-content">Content:</label>
  <textarea id="text-content" rows="6" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent}></textarea>
</div>

<TextAlign element={$selectedElement} {update} title="Content Alignment" id="content-alignment" styleName="textAlign" />

{#if $selectedElement?.style?.backgroundColor}
  <Input id="text-border-radius" label="Border Radius (px):" type="number" min="0" value={getBorderRadius()} oninput={updateBorderRadius} />
{/if}

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>
<Wrapper {updatePageContentWithDebounce} {update} />
<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
<Padding {updatePageContentWithDebounce} {update} />
<Margin {updatePageContentWithDebounce} {update} />
