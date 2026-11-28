<script lang="ts">
import Button from '../../components/Button.svelte'
import FileSelector from '../../components/FileSelector/index.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject, selectedElement } from '../../store.ts'
import type { BlockEditorProps, CardItem, ContentType, LinkMode, LinkSettings, LinkTarget } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import ColorSelect from '../shared/ColorSelect.svelte'
import { getDefaultLinkEditorSettings } from '../shared/helpers.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { update, activeTab = 'content' }: BlockEditorProps = $props()
const block = $derived($selectedElement as ContentType | null)
const items = $derived(($selectedElement as ContentType | null)?.cardItems ?? [])
const style = getStyleEditor()
const columns = $derived(style.mode === 'mobile' && block?.mobileStyle?.cardGridColumns === undefined ? 1 : (style.read('cardGridColumns') ?? 3))

function addItem() {
  update('cardItems', [...items, { id: crypto.randomUUID(), title: 'New card', content: '' }])
}

function updateItem<Key extends 'title' | 'content' | 'src' | 'alt'>(id: string, field: Key, value: CardItem[Key]) {
  update(
    'cardItems',
    items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  )
}

function updateLink<Key extends keyof LinkSettings>(id: string, field: Key, value: LinkSettings[Key]) {
  update(
    'cardItems',
    items.map((item) => (item.id === id ? { ...item, link: { ...(item.link ?? getDefaultLinkEditorSettings($currentProject?.pages[0]?.id ?? '')), [field]: value } } : item))
  )
}

function removeItem(id: string) {
  update(
    'cardItems',
    items.filter((item) => item.id !== id)
  )
}

function moveItem(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.length) {
    return
  }
  const reordered = [...items]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  update('cardItems', reordered)
}

function updateColumns(event: Event) {
  const value = (event.currentTarget as HTMLInputElement).valueAsNumber
  style.set('cardGridColumns', Number.isFinite(value) ? Math.min(6, Math.max(1, Math.round(value))) : undefined)
}
</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Content">
    <Input id="card-grid-title" label="Title:" value={block?.title ?? ''} oninput={(event) => update('title', event.currentTarget.value)} />
    <Textarea id="card-grid-content" label="Description:" rows="3" value={block?.content ?? ''} oninput={(event) => update('content', event.currentTarget.value)} />
  </PanelSection>
  <PanelSection title="Cards">
    {#each items as item, index (item.id)}
      <div class="card-item-editor">
        <div class="card-item-heading">
          <span class="card-item-badge">Card {index + 1}</span>
          <Button
            icon="arrow_upward"
            iconOnly
            variant="ghost"
            size="sm"
            aria-label={`Move card ${index + 1} up`}
            title={`Move card ${index + 1} up`}
            disabled={index === 0}
            onclick={() => moveItem(index, -1)} />
          <Button
            icon="arrow_downward"
            iconOnly
            variant="ghost"
            size="sm"
            aria-label={`Move card ${index + 1} down`}
            title={`Move card ${index + 1} down`}
            disabled={index === items.length - 1}
            onclick={() => moveItem(index, 1)} />
          <Button icon="delete" iconOnly variant="ghost" size="sm" aria-label={`Remove card ${index + 1}`} title={`Remove card ${index + 1}`} onclick={() => removeItem(item.id)} />
        </div>
        <Input id={`card-title-${item.id}`} label="Card title:" value={item.title} oninput={(event) => updateItem(item.id, 'title', event.currentTarget.value)} />
        <Textarea
          id={`card-content-${item.id}`}
          label="Card content:"
          rows="4"
          value={item.content}
          oninput={(event) => updateItem(item.id, 'content', event.currentTarget.value)} />
        <FileSelector
          selected={(file: { url: string; alt: string }) =>
            update(
              'cardItems',
              items.map((card) => (card.id === item.id ? { ...card, src: file.url, alt: file.alt } : card))
            )} />
        <Input id={`card-image-${item.id}`} label="Custom image URL:" value={item.src ?? ''} oninput={(event) => updateItem(item.id, 'src', event.currentTarget.value.trim())} />
        <Input
          id={`card-alt-${item.id}`}
          label="Image description:"
          hint="Leave empty for a decorative image."
          value={item.alt ?? ''}
          oninput={(event) => updateItem(item.id, 'alt', event.currentTarget.value)} />
        <Input
          id={`card-link-text-${item.id}`}
          label="Link label:"
          hint="Leave empty to hide the link."
          value={item.link?.text ?? ''}
          oninput={(event) => updateLink(item.id, 'text', event.currentTarget.value)} />
        <Select
          id={`card-link-mode-${item.id}`}
          label="Destination type:"
          value={item.link?.mode ?? 'url'}
          onchange={(event) => updateLink(item.id, 'mode', event.currentTarget.value as LinkMode)}>
          <option value="url">URL</option>
          <option value="page">Page</option>
        </Select>
        {#if (item.link?.mode ?? 'url') === 'url'}
          <Input id={`card-link-url-${item.id}`} label="URL:" value={item.link?.url ?? ''} oninput={(event) => updateLink(item.id, 'url', event.currentTarget.value.trim())} />
        {:else}
          <Select id={`card-link-page-${item.id}`} label="Page:" value={item.link?.pageId ?? ''} onchange={(event) => updateLink(item.id, 'pageId', event.currentTarget.value)}>
            {#each $currentProject?.pages ?? [] as page}
              <option value={page.id}>{page.title}</option>
            {/each}
          </Select>
        {/if}
      </div>
    {:else}
      <p class="card-grid-hint">No cards yet. Add a card below.</p>
    {/each}
    <Button icon="add" fullWidth onclick={addItem}>Add card</Button>
  </PanelSection>
</div>

<div hidden={activeTab !== 'style'}>
  <TextAlign title="Text alignment" id="card-grid-alignment" styleName="textAlign" />
  <Styles sections={['wrapper', 'custom', 'colors', 'padding', 'margin']}>
    <Input
      id="card-grid-columns"
      label="Columns:"
      type="number"
      min="1"
      max="6"
      step="1"
      hint="Mobile defaults to one column unless overridden."
      value={columns}
      oninput={updateColumns} />
    {#key `${block?.id}:${style.mode}`}
      <SizeInput id="card-grid-gap" label="Gap:" min="0" fallback="24px" value={style.read('cardGridGap')} onvaluechange={(value) => style.set('cardGridGap', value)} />
      <SizeInput
        id="card-grid-padding"
        label="Card padding:"
        min="0"
        fallback="24px"
        value={style.read('cardPadding')}
        onvaluechange={(value) => style.set('cardPadding', value)} />
      <SizeInput
        id="card-grid-radius"
        label="Card corner radius:"
        min="0"
        fallback="12px"
        value={style.read('cardRadius')}
        onvaluechange={(value) => style.set('cardRadius', value)} />
      <SizeInput
        id="card-grid-image-height"
        label="Image height:"
        min="0"
        fallback="200px"
        value={style.read('cardImageHeight')}
        onvaluechange={(value) => style.set('cardImageHeight', value)} />
    {/key}
    <ColorSelect title="Card background" id="card-grid-background" styleName="cardBackgroundColor" isBgColors={true} />
    <ColorSelect title="Card text" id="card-grid-text-color" styleName="cardTextColor" isBgColors={false} />
  </Styles>
</div>

<div hidden={activeTab !== 'other'}>
  <PanelSection title="Link targets">
    {#each items as item, index (item.id)}
      <Select
        id={`card-link-target-${item.id}`}
        label={`Card ${index + 1} target:`}
        value={item.link?.target ?? '_self'}
        onchange={(event) => updateLink(item.id, 'target', event.currentTarget.value as LinkTarget)}>
        <option value="_self">Same tab</option>
        <option value="_blank">New tab</option>
      </Select>
    {:else}
      <p class="card-grid-hint">Add cards in Content to set their link targets.</p>
    {/each}
  </PanelSection>
</div>

<style>
.card-item-editor {
  min-width: 0;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 0.0625rem solid var(--ui-border, #444);
  border-radius: 0.375rem;
  background: var(--ui-panel, #2c2c2c);
}

.card-item-heading {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin-bottom: 0.5rem;
}

.card-item-badge {
  margin-right: auto;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  font-weight: 500;
}

.card-grid-hint {
  margin: 0 0 0.75rem;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>
