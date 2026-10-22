<script lang="ts">
import Input from '../../components/Input.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import { updateBlockField, updateStyleNumber as updateStyleNumberShared } from '../shared/helper.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  updateBlockField('content', textarea.value.trim(), update, updatePageContentWithDebounce)
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  updateBlockField('title', input.value.slice(0, 100), update, updatePageContentWithDebounce)
}

function updateBorderRadius(event: Event) {
  updateStyleNumberShared('borderRadius', event, $selectedElement?.style, update, updatePageContentWithDebounce)
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

<Styles {updatePageContentWithDebounce} {update} />
