<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkMode, LinkSettings, LinkTarget } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import ColorSelect from '../shared/ColorSelect.svelte'
import { getDefaultLinkEditorSettings, updateSelectedLink } from '../shared/helpers.ts'
import Styles from '../shared/Styles.svelte'

const { updatePageContentWithDebounce, activeTab = 'content' }: BlockEditorProps = $props()
const style = getStyleEditor()

function updateLinkElement(updateFn: (element: ContentType, link: LinkSettings) => void) {
  updateSelectedLink(selectedElement, 'link', () => getDefaultLinkEditorSettings($currentProject?.pages?.[0]?.id || ''), updateFn, updatePageContentWithDebounce)
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
</script>

<div hidden={activeTab !== 'content'}>
  <Input id="link-text" label="Text:" value={($selectedElement as ContentType)?.link?.text || ''} oninput={updateText} />

  <Select id="link-mode" label="Destination Type:" value={($selectedElement as ContentType)?.link?.mode || 'url'} oninput={updateMode}>
    <option value="url">URL</option>
    <option value="page">Page</option>
  </Select>

  {#if (($selectedElement as ContentType)?.link?.mode || 'url') === 'url'}
    <Input id="link-url" label="URL:" type="url" value={($selectedElement as ContentType)?.link?.url || ''} placeholder="https://example.com" oninput={updateUrl} />
  {:else}
    <Select id="link-page" label="Page:" value={($selectedElement as ContentType)?.link?.pageId || ''} oninput={updatePageId}>
      {#each $currentProject?.pages ?? [] as page}
        <option value={page.id}>{page.title}</option>
      {/each}
    </Select>
  {/if}
</div>

<div hidden={activeTab !== 'other'}>
  <Select id="link-target" label="Target:" value={($selectedElement as ContentType)?.link?.target || '_self'} oninput={updateTarget}>
    <option value="_self">Same tab</option>
    <option value="_blank">New tab</option>
  </Select>
</div>

<div hidden={activeTab !== 'style'}>
  <Checkbox id="link-button" label="Render as button" checked={style.checked('asButton')} oninput={(event) => style.set('asButton', event.currentTarget.checked)} />

  {#if style.checked('asButton')}
    <ColorSelect title="Button color" id="link-button-style" styleName="buttonColor" isBgColors={true} />
    <ColorSelect title="Button text color" id="link-button-text-color" styleName="buttonTextColor" isBgColors={false} />
  {/if}

  <Styles />
</div>
