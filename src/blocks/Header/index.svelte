<script lang="ts">
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import { updateBlockField, updateStyleNumber as updateStyleNumberShared } from '../shared/helper.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

function updateContent(event: Event) {
  const input = event.target as HTMLInputElement
  updateBlockField('content', input.value, update, updatePageContentWithDebounce)
}

function updateLevel(event: Event) {
  const select = event.target as HTMLSelectElement
  updateBlockField('headerLevel', select.value, update, updatePageContentWithDebounce)
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

<Select id="header-level" label="Level:" value={($selectedElement as ContentType)?.headerLevel || 'h2'} onchange={updateLevel}>
  <option value="h1">H1</option>
  <option value="h2">H2</option>
  <option value="h3">H3</option>
  <option value="h4">H4</option>
  <option value="h5">H5</option>
  <option value="h6">H6</option>
</Select>

<Input id="header-content" label="Text:" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent} />

<TextAlign element={$selectedElement} {update} title="Text Alignment" id="text-alignment" styleName="textAlign" />

{#if $selectedElement?.style?.backgroundColor}
  <Input id="header-border-radius" label="Border Radius (px):" type="number" min="0" value={getBorderRadius()} oninput={updateBorderRadius} />
{/if}

<Styles {updatePageContentWithDebounce} {update} />
