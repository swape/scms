<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkSettings } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import { getDefaultSplitBlockLinkSettings, updateBlockField, updateSelectedLink } from '../shared/helpers.ts'
import ImageSource from '../shared/ImageSource.svelte'
import LinkDestination from '../shared/LinkDestination.svelte'
import LinkTarget from '../shared/LinkTarget.svelte'
import Styles from '../shared/Styles.svelte'

const { updatePageContentWithDebounce, update, activeTab = 'content' }: BlockEditorProps = $props()
const style = getStyleEditor()

const selectedBlock = $derived($selectedElement as ContentType)

function updateLinkElement(updateFn: (link: LinkSettings) => void) {
  updateSelectedLink(
    selectedElement,
    'splitBlock',
    () => getDefaultSplitBlockLinkSettings($currentProject?.pages?.[0]?.id || ''),
    (_element, link) => updateFn(link),
    updatePageContentWithDebounce
  )
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  updateBlockField('title', input.value, update, updatePageContentWithDebounce)
}

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  updateBlockField('content', textarea.value, update, updatePageContentWithDebounce)
}

function updateButtonText(event: Event) {
  const input = event.target as HTMLInputElement
  updateLinkElement((link) => {
    link.text = input.value
  })
}

</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Wrapper">
    <Input id="split-title" label="Text block title:" value={selectedBlock?.title || ''} oninput={updateTitle} />

    <Textarea id="split-content" label="Text block content:" rows="5" value={selectedBlock?.content || ''} oninput={updateContent} />
  </PanelSection>

  <PanelSection title="Button">
    <Input id="split-button-text" label="Button text:" value={selectedBlock?.link?.text || ''} oninput={updateButtonText} />

    <LinkDestination idPrefix="split-button" link={selectedBlock?.link} onchange={updateLinkElement} />
  </PanelSection>

  <PanelSection title="Image">
    {#if selectedBlock?.src}
      <div class="mb-3">
        <img src={selectedBlock.src} alt={selectedBlock.alt} class="w-full h-auto rounded" />
      </div>
    {/if}

    <ImageSource id="split-image-url" src={selectedBlock?.src ?? ''} {update} onfile={updatePageContentWithDebounce} />
  </PanelSection>
</div>

<div hidden={activeTab !== 'style'}>
  <Checkbox id="split-flipped" label="Flip sides (image on left)" checked={style.checked('flipped')} oninput={(event) => style.set('flipped', event.currentTarget.checked)} />
  <Styles sections={['wrapper', 'custom', 'colors', 'padding', 'margin']}>
    {#key `${selectedBlock?.id}:${style.mode}`}
      <SizeInput
        id="split-border-radius"
        label="Border radius:"
        min="0"
        fallback="8px"
        value={style.read('borderRadius')}
        onvaluechange={(value) => style.set('borderRadius', value)} />
      <SizeInput
        label="Text padding:"
        id="split-text-padding"
        min="0"
        fallback="24px"
        value={style.read('splitTextPadding')}
        onvaluechange={(value) => style.set('splitTextPadding', value)} />
      <SizeInput
        label="Image minimum height:"
        id="split-image-min-height"
        min="0"
        fallback="300px"
        value={style.read('splitImageMinHeight')}
        onvaluechange={(value) => style.set('splitImageMinHeight', value)} />
    {/key}
  </Styles>
</div>

<div hidden={activeTab !== 'other'}>
  <PanelSection title="Button">
    <LinkTarget id="split-button-target" link={selectedBlock?.link} onchange={updateLinkElement} />
  </PanelSection>
</div>
