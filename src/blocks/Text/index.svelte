<script lang="ts">
import Input from '../../components/Input.svelte'
import Textarea from '../../components/Textarea.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import { updateBlockField, updateStyleNumber as updateStyleNumberShared } from '../shared/helpers.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

function getSelectedStyle(): Record<string, string | number> | undefined {
  const element = $selectedElement

  return element && 'style' in element ? element.style : undefined
}

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  updateBlockField('content', textarea.value.trim(), update, updatePageContentWithDebounce)
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  updateBlockField('title', input.value.slice(0, 100), update, updatePageContentWithDebounce)
}

function updateBorderRadius(event: Event) {
  updateStyleNumberShared('borderRadius', event, getSelectedStyle(), update, updatePageContentWithDebounce)
}

function getBorderRadius(): string {
  const value = getSelectedStyle()?.borderRadius
  if (value === undefined || value === null || value === '') {
    return '8'
  }
  return String(value)
}
</script>

<Input id="text-title" label="Title:" value={$selectedElement?.title || ''} oninput={updateTitle} />

<TextAlign element={$selectedElement} {update} title="Title Alignment" id="title-alignment" styleName="titleAlign" />

<Textarea id="text-content" label="Content:" rows="6" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent} />

<TextAlign element={$selectedElement} {update} title="Content Alignment" id="content-alignment" styleName="textAlign" />

{#if getSelectedStyle()?.backgroundColor}
  <Input id="text-border-radius" label="Border Radius (px):" type="number" min="0" value={getBorderRadius()} oninput={updateBorderRadius} />
{/if}

<Styles {updatePageContentWithDebounce} {update} />
