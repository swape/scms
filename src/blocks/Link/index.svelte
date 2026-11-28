<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import Input from '../../components/Input.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkSettings } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import ColorSelect from '../shared/ColorSelect.svelte'
import { getDefaultLinkEditorSettings, updateSelectedLink } from '../shared/helpers.ts'
import LinkDestination from '../shared/LinkDestination.svelte'
import LinkTarget from '../shared/LinkTarget.svelte'
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

function updateLink(change: (link: LinkSettings) => void) {
  updateLinkElement((_element, link) => change(link))
}
</script>

<div hidden={activeTab !== 'content'}>
  <Input id="link-text" label="Text:" value={($selectedElement as ContentType)?.link?.text || ''} oninput={updateText} />

  <LinkDestination idPrefix="link" modeLabel="Destination Type:" link={($selectedElement as ContentType)?.link} onchange={updateLink} />
</div>

<div hidden={activeTab !== 'other'}>
  <LinkTarget id="link-target" link={($selectedElement as ContentType)?.link} onchange={updateLink} />
</div>

<div hidden={activeTab !== 'style'}>
  <Checkbox id="link-button" label="Render as button" checked={style.checked('asButton')} oninput={(event) => style.set('asButton', event.currentTarget.checked)} />

  {#if style.checked('asButton')}
    <ColorSelect title="Button color" id="link-button-style" styleName="buttonColor" isBgColors={true} />
    <ColorSelect title="Button text color" id="link-button-text-color" styleName="buttonTextColor" isBgColors={false} />
  {/if}

  <Styles />
</div>
