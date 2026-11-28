<script lang="ts">
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkMode, LinkSettings, LinkTarget } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import ColorSelect from '../shared/ColorSelect.svelte'
import { getDefaultLinkSettings, updateSelectedLink } from '../shared/helpers.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { update, updatePageContentWithDebounce, activeTab = 'content' }: BlockEditorProps = $props()
const block = $derived($selectedElement as ContentType)
const style = getStyleEditor()

function updateLink(change: (link: LinkSettings) => void) {
  updateSelectedLink(
    selectedElement,
    'callToAction',
    () => getDefaultLinkSettings($currentProject?.pages[0]?.id || ''),
    (_element, link) => change(link),
    updatePageContentWithDebounce
  )
}
</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Content">
    <Input id="cta-title" label="Heading:" value={block?.title ?? ''} oninput={(event) => update('title', event.currentTarget.value)} />
    <Textarea id="cta-content" label="Description:" rows="4" value={block?.content ?? ''} oninput={(event) => update('content', event.currentTarget.value)} />
  </PanelSection>
  <PanelSection title="Button">
    <Input
      id="cta-button-text"
      label="Button text:"
      hint="Leave empty to hide the button."
      value={block?.link?.text ?? ''}
      oninput={(event) =>
        updateLink((link) => {
          link.text = event.currentTarget.value
        })} />
    <Select
      id="cta-button-mode"
      label="Destination type:"
      value={block?.link?.mode ?? 'url'}
      onchange={(event) =>
        updateLink((link) => {
          link.mode = event.currentTarget.value as LinkMode
        })}>
      <option value="url">URL</option>
      <option value="page">Page</option>
    </Select>
    {#if (block?.link?.mode ?? 'url') === 'url'}
      <Input
        id="cta-button-url"
        label="URL:"
        value={block?.link?.url ?? ''}
        oninput={(event) =>
          updateLink((link) => {
            link.url = event.currentTarget.value.trim()
          })} />
    {:else}
      <Select
        id="cta-button-page"
        label="Page:"
        value={block?.link?.pageId ?? ''}
        onchange={(event) =>
          updateLink((link) => {
            link.pageId = event.currentTarget.value
          })}>
        {#each $currentProject?.pages ?? [] as page}
          <option value={page.id}>{page.title}</option>
        {/each}
      </Select>
    {/if}
  </PanelSection>
</div>

<div hidden={activeTab !== 'style'}>
  <TextAlign title="Content alignment" id="cta-alignment" styleName="textAlign" />
  <Styles sections={['wrapper', 'custom', 'colors', 'padding', 'margin']}>
    {#key `${block?.id}:${style.mode}`}
      <SizeInput
        id="cta-width"
        label="Content width:"
        min="0"
        fallback="720px"
        value={style.read('ctaContentWidth')}
        onvaluechange={(value) => style.set('ctaContentWidth', value)} />
      <SizeInput
        id="cta-heading-size"
        label="Heading size:"
        min="0"
        defaultUnit="rem"
        fallback="2rem"
        value={style.read('ctaHeadingSize')}
        onvaluechange={(value) => style.set('ctaHeadingSize', value)} />
    {/key}
    <ColorSelect title="Button background" id="cta-button-bg" styleName="ctaButtonColor" isBgColors={true} />
    <ColorSelect title="Button text" id="cta-button-color" styleName="ctaButtonTextColor" isBgColors={false} />
  </Styles>
</div>

<div hidden={activeTab !== 'other'}>
  <Select
    id="cta-target"
    label="Target:"
    value={block?.link?.target ?? '_self'}
    onchange={(event) =>
      updateLink((link) => {
        link.target = event.currentTarget.value as LinkTarget
      })}>
    <option value="_self">Same tab</option>
    <option value="_blank">New tab</option>
  </Select>
</div>
