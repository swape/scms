<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import FileSelector from '../../components/FileSelector/index.svelte'
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkMode, LinkSettings, LinkTarget } from '../../types/types.ts'
import Margin from '../shared/Margin.svelte'
import Padding from '../shared/Padding.svelte'
import TextAndBackgroundColors from '../shared/TextAndBackgroundColors.svelte'
import Wrapper from '../shared/Wrapper.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

const selectedBlock = $derived($selectedElement as ContentType)

function getDefaultLinkSettings(): LinkSettings {
  const firstPageId = $currentProject?.pages?.[0]?.id || ''
  return {
    text: 'Learn more',
    mode: 'url',
    url: '',
    pageId: firstPageId,
    target: '_self',
    asButton: true,
  }
}

function updateLinkElement(updateFn: (link: LinkSettings) => void) {
  selectedElement.update((element) => {
    if (!element || element.type !== 'splitBlock') {
      return element
    }

    const splitBlock = element as ContentType
    if (!splitBlock.link) {
      splitBlock.link = getDefaultLinkSettings()
    }

    updateFn(splitBlock.link)
    updatePageContentWithDebounce()
    return { ...splitBlock, link: { ...splitBlock.link } }
  })
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  update('title', input.value)
  updatePageContentWithDebounce()
}

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  update('content', textarea.value)
  updatePageContentWithDebounce()
}

function updateFlipped(event: Event) {
  const input = event.target as HTMLInputElement
  update('flipped', input.checked)
  updatePageContentWithDebounce()
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

function updateStyleNumber(key: string, event: Event) {
  const input = event.target as HTMLInputElement
  const style = { ...$selectedElement?.style }
  if (!input.value.trim()) {
    delete style[key]
  } else {
    style[key] = Number(input.value)
  }
  update('style', style)
  updatePageContentWithDebounce()
}
</script>

<Checkbox id="split-flipped" label="Flip sides (image on left)" checked={Boolean(selectedBlock?.flipped)} oninput={updateFlipped} />

<div class="mt-5 pt-5 border-t border-slate-700 mb-3 text-gray-500 text-sm">Wrapper:</div>

<Input id="split-title" label="Text block title:" value={selectedBlock?.title || ''} oninput={updateTitle} />

<div class="input-and-label-wrapper">
  <label for="split-content">Text block content:</label>
  <textarea id="split-content" rows="5" value={selectedBlock?.content || ''} oninput={updateContent}></textarea>
</div>

<div class="mt-5 pt-5 border-t border-slate-700 mb-3 text-gray-500 text-sm">Button:</div>

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

<Select id="split-button-target" label="Target:" value={selectedBlock?.link?.target || '_self'} oninput={updateTarget}>
  <option value="_self">Same tab</option>
  <option value="_blank">New tab</option>
</Select>

<div class="mt-5 pt-5 border-t border-slate-700 mb-3 text-gray-500 text-sm">Image:</div>

{#if selectedBlock?.src}
  <div class="mb-4">
    <img src={selectedBlock.src} alt={selectedBlock.alt} class="w-full h-auto rounded" />
  </div>
{/if}

<FileSelector selected={selectedFile} />

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>
<Wrapper {updatePageContentWithDebounce} {update} />
<Input
  id="split-border-radius"
  label="Border radius (px):"
  type="number"
  min="0"
  value={$selectedElement?.style?.borderRadius ?? 8}
  oninput={(event) => updateStyleNumber('borderRadius', event)} />
<Input
  label="Text padding (px):"
  id="split-text-padding"
  type="number"
  min="0"
  placeholder="24"
  value={$selectedElement?.style?.splitTextPadding ?? ''}
  oninput={(event) => updateStyleNumber('splitTextPadding', event)} />
<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
<Padding {updatePageContentWithDebounce} {update} />
<Margin {updatePageContentWithDebounce} {update} />
