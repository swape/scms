<script lang="ts">
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import { updateBlockField } from '../shared/helpers.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { updatePageContentWithDebounce, update, activeTab = 'content' }: BlockEditorProps = $props()
const style = getStyleEditor()
const selectedBlock = $derived($selectedElement && 'pageId' in $selectedElement ? $selectedElement : null)

function updateContent(event: Event) {
  const input = event.target as HTMLInputElement
  updateBlockField('content', input.value, update, updatePageContentWithDebounce)
}

function updateLevel(event: Event) {
  const select = event.target as HTMLSelectElement
  updateBlockField('headerLevel', select.value, update, updatePageContentWithDebounce)
}
</script>

<div hidden={activeTab !== 'content'}>
  <Select id="header-level" label="Level:" value={selectedBlock?.headerLevel || 'h2'} onchange={updateLevel}>
    <option value="h1">H1</option>
    <option value="h2">H2</option>
    <option value="h3">H3</option>
    <option value="h4">H4</option>
    <option value="h5">H5</option>
    <option value="h6">H6</option>
  </Select>

  <Input id="header-content" label="Text:" value={selectedBlock?.content || ''} oninput={updateContent} />
</div>

<div hidden={activeTab !== 'style'}>
  <TextAlign title="Text Alignment" id="text-alignment" styleName="textAlign" />

  {#key `${selectedBlock?.id}:${style.mode}`}
    {#if style.read('backgroundColor')}
      <SizeInput
        id="header-border-radius"
        label="Border Radius:"
        min="0"
        fallback="8px"
        value={style.read('borderRadius')}
        onvaluechange={(value) => style.set('borderRadius', value)} />
    {/if}
  {/key}

  <Styles />
</div>
