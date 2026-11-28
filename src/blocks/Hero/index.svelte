<script lang="ts">
import Button from '../../components/Button.svelte'
import FileSelector from '../../components/FileSelector/index.svelte'
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
    'hero',
    () => getDefaultLinkSettings($currentProject?.pages[0]?.id || ''),
    (_element, link) => change(link),
    updatePageContentWithDebounce
  )
}

function selectedFile(file: { url: string; alt: string; type: string; id: string }) {
  update('src', file.url)
  update('alt', file.alt)
  update('imageType', file.type)
  update('imageId', file.id)
}
</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Content">
    <Input id="hero-title" label="Heading:" value={block?.title ?? ''} oninput={(event) => update('title', event.currentTarget.value)} />
    <Textarea id="hero-content" label="Description:" rows="4" value={block?.content ?? ''} oninput={(event) => update('content', event.currentTarget.value)} />
  </PanelSection>
  <PanelSection title="Background image">
    <Input
      id="hero-image"
      label="Custom image URL:"
      value={block?.src ?? ''}
      oninput={(event) => {
        update('src', event.currentTarget.value.trim())
        update('imageId', '')
        update('imageType', '')
      }} />
    <FileSelector selected={selectedFile} />
    {#if block?.src}
      <Button
        icon="delete"
        onclick={() => {
          update('src', '')
          update('imageId', '')
          update('alt', '')
        }}>
        Remove image
      </Button>
    {/if}
  </PanelSection>
  <PanelSection title="Button">
    <Input
      id="hero-button-text"
      label="Button text:"
      hint="Leave empty to hide the button."
      value={block?.link?.text ?? ''}
      oninput={(event) =>
        updateLink((link) => {
          link.text = event.currentTarget.value
        })} />
    <Select
      id="hero-button-mode"
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
        id="hero-button-url"
        label="URL:"
        value={block?.link?.url ?? ''}
        oninput={(event) =>
          updateLink((link) => {
            link.url = event.currentTarget.value.trim()
          })} />
    {:else}
      <Select
        id="hero-button-page"
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
  <TextAlign title="Content alignment" id="hero-alignment" styleName="textAlign" />
  <Styles sections={['wrapper', 'custom', 'colors', 'padding', 'margin']}>
    {#key `${block?.id}:${style.mode}`}
      <SizeInput
        id="hero-height"
        label="Minimum height:"
        min="0"
        fallback="420px"
        value={style.read('heroMinHeight')}
        onvaluechange={(value) => style.set('heroMinHeight', value)} />
      <SizeInput
        id="hero-width"
        label="Content width:"
        min="0"
        fallback="720px"
        value={style.read('heroContentWidth')}
        onvaluechange={(value) => style.set('heroContentWidth', value)} />
      <SizeInput
        id="hero-heading-size"
        label="Heading size:"
        min="0"
        defaultUnit="rem"
        fallback="3rem"
        value={style.read('heroHeadingSize')}
        onvaluechange={(value) => style.set('heroHeadingSize', value)} />
    {/key}
    <Input
      id="hero-overlay"
      label="Image overlay (%):"
      type="number"
      min="0"
      max="100"
      value={style.read('heroOverlay') ?? 40}
      oninput={(event) => style.set('heroOverlay', event.currentTarget.value)} />
    <ColorSelect title="Button background" id="hero-button-bg" styleName="heroButtonColor" isBgColors={true} />
    <ColorSelect title="Button text" id="hero-button-color" styleName="heroButtonTextColor" isBgColors={false} />
  </Styles>
</div>

<div hidden={activeTab !== 'other'}>
  <Select id="hero-level" label="Heading level:" value={block?.headerLevel ?? 'h1'} onchange={(event) => update('headerLevel', event.currentTarget.value)}>
    <option value="h1">H1</option>
    <option value="h2">H2</option>
    <option value="h3">H3</option>
  </Select>
  <Select
    id="hero-target"
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
