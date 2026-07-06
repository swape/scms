<script lang="ts">
import { currentProject, selectedElement } from '../../../../store.ts'
import type { ContentType, LinkMode, LinkSettings, LinkTarget } from '../../../../types/types.ts'

const { updatePageContentWithDebounce } = $props()

function getDefaultLinkSettings(): LinkSettings {
  const firstPageId = $currentProject?.pages?.[0]?.id || ''
  return {
    text: '',
    mode: 'url',
    url: '',
    pageId: firstPageId,
    target: '_self',
    asButton: false,
  }
}

function updateLinkElement(updateFn: (element: ContentType, link: LinkSettings) => void) {
  selectedElement.update((element) => {
    if (!element || element.type !== 'link') {
      return element
    }

    const linkElement = element as ContentType
    if (!linkElement.link) {
      linkElement.link = getDefaultLinkSettings()
    }

    updateFn(linkElement, linkElement.link)
    updatePageContentWithDebounce()
    return element
  })
}

function updateText(event: Event) {
  const input = event.target as HTMLInputElement
  updateLinkElement((element, link) => {
    link.text = input.value
    if (!element.title || element.title === 'Link') {
      element.title = input.value.slice(0, 100) || 'Link'
    }
  })
}

function updateMode(event: Event) {
  const select = event.target as HTMLSelectElement
  updateLinkElement((_element, link) => {
    link.mode = select.value as LinkMode
  })
}

function updateTarget(event: Event) {
  const select = event.target as HTMLSelectElement
  updateLinkElement((_element, link) => {
    link.target = select.value as LinkTarget
  })
}

function updateUrl(event: Event) {
  const input = event.target as HTMLInputElement
  updateLinkElement((_element, link) => {
    link.url = input.value.trim()
  })
}

function updatePageId(event: Event) {
  const select = event.target as HTMLSelectElement
  updateLinkElement((_element, link) => {
    link.pageId = select.value
  })
}

function updateAsButton(event: Event) {
  const input = event.target as HTMLInputElement
  updateLinkElement((_element, link) => {
    link.asButton = input.checked
  })
}
</script>

<div class="input-and-label-wrapper">
  <label for="link-text">Text:</label>
  <input id="link-text" type="text" value={($selectedElement as ContentType)?.link?.text || ''} oninput={updateText} />
</div>

<div class="input-and-label-wrapper">
  <label for="link-mode">Destination Type:</label>
  <select id="link-mode" value={($selectedElement as ContentType)?.link?.mode || 'url'} oninput={updateMode}>
    <option value="url">URL</option>
    <option value="page">Page</option>
  </select>
</div>

{#if (($selectedElement as ContentType)?.link?.mode || 'url') === 'url'}
  <div class="input-and-label-wrapper">
    <label for="link-url">URL:</label>
    <input id="link-url" type="url" value={($selectedElement as ContentType)?.link?.url || ''} placeholder="https://example.com" oninput={updateUrl} />
  </div>
{:else}
  <div class="input-and-label-wrapper">
    <label for="link-page">Page:</label>
    <select id="link-page" value={($selectedElement as ContentType)?.link?.pageId || ''} oninput={updatePageId}>
      {#each $currentProject?.pages ?? [] as page}
        <option value={page.id}>{page.title}</option>
      {/each}
    </select>
  </div>
{/if}

<div class="input-and-label-wrapper">
  <label for="link-target">Target:</label>
  <select id="link-target" value={($selectedElement as ContentType)?.link?.target || '_self'} oninput={updateTarget}>
    <option value="_self">Same tab</option>
    <option value="_blank">New tab</option>
  </select>
</div>

<div class="input-and-label-wrapper checkbox-wrapper">
  <label for="link-button">Render as button:</label>
  <input id="link-button" type="checkbox" checked={Boolean(($selectedElement as ContentType)?.link?.asButton)} oninput={updateAsButton} />
</div>

<style>
.checkbox-wrapper {
  padding-block: 10px;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
</style>
