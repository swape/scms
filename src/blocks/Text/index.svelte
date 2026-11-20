<script lang="ts">
import Input from '../../components/Input.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import { updateBlockField } from '../shared/helpers.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { updatePageContentWithDebounce, update, activeTab = 'content' }: BlockEditorProps = $props()

const style = getStyleEditor()

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  updateBlockField('content', textarea.value.trim(), update, updatePageContentWithDebounce)
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  updateBlockField('title', input.value.slice(0, 100), update, updatePageContentWithDebounce)
}
</script>

<div hidden={activeTab !== 'content'}>
  <Input id="text-title" label="Title:" value={$selectedElement?.title || ''} oninput={updateTitle} />

  <Textarea id="text-content" label="Content:" rows="6" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent} />
</div>

<div hidden={activeTab !== 'style'}>
  <TextAlign title="Title Alignment" id="title-alignment" styleName="titleAlign" />

  <TextAlign title="Content Alignment" id="content-alignment" styleName="textAlign" />

  {#key `${$selectedElement?.id}:${style.mode}`}
    {#if style.read('backgroundColor')}
      <SizeInput
        id="text-border-radius"
        label="Border Radius:"
        min="0"
        fallback="8px"
        value={style.read('borderRadius')}
        onvaluechange={(value) => style.set('borderRadius', value)} />
    {/if}
  {/key}

  <Styles />
</div>
