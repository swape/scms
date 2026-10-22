<script lang="ts">
import FileSelector from '../../components/FileSelector/index.svelte'
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
    return element
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

<div class="input-and-label-wrapper checkbox-wrapper">
  <label for="split-flipped">Flip sides (image on left):</label>
  <input id="split-flipped" type="checkbox" checked={Boolean(selectedBlock?.flipped)} oninput={updateFlipped} />
</div>

<div class="mt-5 pt-5 border-t border-slate-700 mb-3 text-gray-500 text-sm">Wrapper:</div>

<div class="input-and-label-wrapper">
  <label for="split-title">Text block title:</label>
  <input id="split-title" type="text" value={selectedBlock?.title || ''} oninput={updateTitle} />
</div>

<div class="input-and-label-wrapper">
  <label for="split-content">Text block content:</label>
  <textarea id="split-content" rows="5" value={selectedBlock?.content || ''} oninput={updateContent}></textarea>
</div>

<div class="mt-5 pt-5 border-t border-slate-700 mb-3 text-gray-500 text-sm">Button:</div>

<div class="input-and-label-wrapper">
  <label for="split-button-text">Button text:</label>
  <input id="split-button-text" type="text" value={selectedBlock?.link?.text || ''} oninput={updateButtonText} />
</div>

<div class="input-and-label-wrapper">
  <label for="split-button-mode">Destination type:</label>
  <select id="split-button-mode" value={selectedBlock?.link?.mode || 'url'} oninput={updateMode}>
    <option value="url">URL</option>
    <option value="page">Page</option>
  </select>
</div>

{#if (selectedBlock?.link?.mode || 'url') === 'url'}
  <div class="input-and-label-wrapper">
    <label for="split-button-url">URL:</label>
    <input id="split-button-url" type="url" value={selectedBlock?.link?.url || ''} placeholder="https://example.com" oninput={updateUrl} />
  </div>
{:else}
  <div class="input-and-label-wrapper">
    <label for="split-button-page">Page:</label>
    <select id="split-button-page" value={selectedBlock?.link?.pageId || ''} oninput={updatePageId}>
      {#each $currentProject?.pages || [] as page}
        <option value={page.id}>{page.title}</option>
      {/each}
    </select>
  </div>
{/if}

<div class="input-and-label-wrapper">
  <label for="split-button-target">Target:</label>
  <select id="split-button-target" value={selectedBlock?.link?.target || '_self'} oninput={updateTarget}>
    <option value="_self">Same tab</option>
    <option value="_blank">New tab</option>
  </select>
</div>

<div class="mt-5 pt-5 border-t border-slate-700 mb-3 text-gray-500 text-sm">Image:</div>

{#if selectedBlock?.src}
  <div class="mb-4">
    <img src={selectedBlock.src} alt={selectedBlock.alt} class="w-full h-auto rounded" />
  </div>
{/if}

<FileSelector selected={selectedFile} />

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>
<Wrapper {updatePageContentWithDebounce} {update} />
<div class="input-and-label-wrapper">
  <label for="split-border-radius">Border radius (px):</label>
  <input id="split-border-radius" type="number" min="0" value={$selectedElement?.style?.borderRadius ?? 8} oninput={(event) => updateStyleNumber('borderRadius', event)} />
</div>
<div class="input-and-label-wrapper">
  <label for="split-text-padding">Text padding (px):</label>
  <input
    id="split-text-padding"
    type="number"
    min="0"
    placeholder="24"
    value={$selectedElement?.style?.splitTextPadding ?? ''}
    oninput={(event) => updateStyleNumber('splitTextPadding', event)} />
</div>
<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
<Padding {updatePageContentWithDebounce} {update} />
<Margin {updatePageContentWithDebounce} {update} />
