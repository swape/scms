<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import FileSelector from '../../components/FileSelector/index.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkMode, LinkSettings, LinkTarget } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import { getDefaultSplitBlockLinkSettings, updateBlockField, updateSelectedLink } from '../shared/helpers.ts'
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

function updateMode(event: Event) {
  const select = event.target as HTMLSelectElement
  updateLinkElement((link) => {
    link.mode = select.value as LinkMode
  })
}

function updateUrl(event: Event) {
  const input = event.target as HTMLInputElement
  updateLinkElement((link) => {
    link.url = input.value.trim()
  })
}

function updatePageId(event: Event) {
  const select = event.target as HTMLSelectElement
  updateLinkElement((link) => {
    link.pageId = select.value
  })
}

function updateTarget(event: Event) {
  const select = event.target as HTMLSelectElement
  updateLinkElement((link) => {
    link.target = select.value as LinkTarget
  })
}

function selectedFile(file: { id: string; name: string; size: string; url: string; alt: string; type: string; parentFolder: string; caption: string }) {
  update('src', file.url)
  update('alt', file.alt)
  update('imageType', file.type)
  update('imageId', file.id)
  updatePageContentWithDebounce()
}
</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Wrapper">
    <Input id="split-title" label="Text block title:" value={selectedBlock?.title || ''} oninput={updateTitle} />

    <Textarea id="split-content" label="Text block content:" rows="5" value={selectedBlock?.content || ''} oninput={updateContent} />
  </PanelSection>

  <PanelSection title="Button">
    <Input id="split-button-text" label="Button text:" value={selectedBlock?.link?.text || ''} oninput={updateButtonText} />

    <Select id="split-button-mode" label="Destination type:" value={selectedBlock?.link?.mode || 'url'} oninput={updateMode}>
      <option value="url">URL</option>
      <option value="page">Page</option>
    </Select>

    {#if (selectedBlock?.link?.mode || 'url') === 'url'}
      <Input id="split-button-url" label="URL:" type="url" value={selectedBlock?.link?.url || ''} placeholder="https://example.com" oninput={updateUrl} />
    {:else}
      <Select id="split-button-page" label="Page:" value={selectedBlock?.link?.pageId || ''} oninput={updatePageId}>
        {#each $currentProject?.pages || [] as page}
          <option value={page.id}>{page.title}</option>
        {/each}
      </Select>
    {/if}
  </PanelSection>

  <PanelSection title="Image">
    {#if selectedBlock?.src}
      <div class="mb-3">
        <img src={selectedBlock.src} alt={selectedBlock.alt} class="w-full h-auto rounded" />
      </div>
    {/if}

    <FileSelector selected={selectedFile} />
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
    <Select id="split-button-target" label="Target:" value={selectedBlock?.link?.target || '_self'} oninput={updateTarget}>
      <option value="_self">Same tab</option>
      <option value="_blank">New tab</option>
    </Select>
  </PanelSection>
</div>
