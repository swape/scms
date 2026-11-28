<script lang="ts">
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, LinkSettings } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import ColorSelect from '../shared/ColorSelect.svelte'
import { getDefaultLinkSettings, updateSelectedLink } from '../shared/helpers.ts'
import LinkDestination from '../shared/LinkDestination.svelte'
import LinkTarget from '../shared/LinkTarget.svelte'
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
    <LinkDestination idPrefix="cta-button" link={block?.link} onchange={updateLink} />
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
  <LinkTarget id="cta-target" link={block?.link} onchange={updateLink} />
</div>
