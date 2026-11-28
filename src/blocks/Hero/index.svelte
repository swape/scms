<script lang="ts">
import Button from '../../components/Button.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkSettings } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import ColorSelect from '../shared/ColorSelect.svelte'
import ImageSource from '../shared/ImageSource.svelte'
import LinkDestination from '../shared/LinkDestination.svelte'
import LinkTarget from '../shared/LinkTarget.svelte'
import { getDefaultLinkSettings, updateSelectedLink } from '../shared/helpers.ts'
import HeaderSizeSelect from '../shared/HeaderSizeSelect.svelte'
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

</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Content">
    <Input id="hero-title" label="Heading:" value={block?.title ?? ''} oninput={(event) => update('title', event.currentTarget.value)} />
    <Textarea id="hero-content" label="Description:" rows="4" value={block?.content ?? ''} oninput={(event) => update('content', event.currentTarget.value)} />
  </PanelSection>
  <PanelSection title="Background image">
    <ImageSource id="hero-image" src={block?.src ?? ''} {update} />
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
    <LinkDestination idPrefix="hero-button" link={block?.link} onchange={updateLink} />
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
  <HeaderSizeSelect id="hero-level" maxLevel={3} value={block?.headerLevel ?? 'h1'} onchange={(level) => update('headerLevel', level)} />
  <LinkTarget id="hero-target" link={block?.link} onchange={updateLink} />
</div>
