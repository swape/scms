<script lang="ts">
import Button from '../../components/Button.svelte'
import Checkbox from '../../components/Checkbox.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Textarea from '../../components/Textarea.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType, FaqItem } from '../../types/types.ts'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { update, updatePageContentWithDebounce }: BlockEditorProps = $props()
const items = $derived(($selectedElement as ContentType | null)?.faqItems ?? [])
const closeOthers = $derived(Boolean(($selectedElement as ContentType | null)?.faqCloseOthers))

function addItem() {
  update('faqItems', [...items, { id: crypto.randomUUID(), question: 'New question', answer: '' }])
}

function updateItem<Key extends 'question' | 'answer' | 'openOnStart'>(id: string, field: Key, value: FaqItem[Key]) {
  update(
    'faqItems',
    items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
  )
}

function removeItem(id: string) {
  update(
    'faqItems',
    items.filter((item) => item.id !== id)
  )
}

function moveItem(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.length) {
    return
  }
  const reordered: FaqItem[] = [...items]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  update('faqItems', reordered)
}
</script>

<Input id="faq-title" label="Title:" value={$selectedElement?.title ?? ''} oninput={(event) => update('title', event.currentTarget.value)} />
<TextAlign element={$selectedElement} {update} title="Title Alignment" id="title-alignment" styleName="titleAlign" />

<Checkbox id="faq-close-others" label="Close other answers when opening one" checked={closeOthers} oninput={(event) => update('faqCloseOthers', event.currentTarget.checked)} />
{#if closeOthers}
  <p class="faq-hint">Only the first question marked Open on start will start open.</p>
{/if}

<PanelSection title="Questions and answers" class="faq-section">
  {#each items as item, index (item.id)}
    <div class="faq-item-editor">
      <div class="faq-item-heading">
        <span class="faq-item-badge">Question {index + 1}</span>
        <div class="faq-item-order">
          <Button
            class="faq-icon-button"
            icon="arrow_upward"
            iconOnly
            variant="ghost"
            size="sm"
            aria-label={`Move question ${index + 1} up`}
            title={`Move question ${index + 1} up`}
            disabled={index === 0}
            onclick={() => moveItem(index, -1)} />
          <Button
            class="faq-icon-button"
            icon="arrow_downward"
            iconOnly
            variant="ghost"
            size="sm"
            aria-label={`Move question ${index + 1} down`}
            title={`Move question ${index + 1} down`}
            disabled={index === items.length - 1}
            onclick={() => moveItem(index, 1)} />
        </div>
        <Button
          class="faq-icon-button faq-remove"
          icon="delete"
          iconOnly
          variant="ghost"
          size="sm"
          aria-label={`Remove question ${index + 1}`}
          title={`Remove question ${index + 1}`}
          onclick={() => removeItem(item.id)} />
      </div>
      <Input id={`faq-question-${item.id}`} label="Question:" value={item.question} oninput={(event) => updateItem(item.id, 'question', event.currentTarget.value)} />
      <Textarea id={`faq-answer-${item.id}`} label="Answer:" rows="4" value={item.answer} oninput={(event) => updateItem(item.id, 'answer', event.currentTarget.value)} />
      <Checkbox
        id={`faq-open-on-start-${item.id}`}
        label="Open on start"
        checked={Boolean(item.openOnStart)}
        oninput={(event) => updateItem(item.id, 'openOnStart', event.currentTarget.checked)} />
    </div>
  {:else}
    <p class="faq-hint">No questions yet. Add a question below.</p>
  {/each}
  <Button class="faq-add" icon="add" fullWidth onclick={addItem}>Add question</Button>
</PanelSection>

<TextAlign element={$selectedElement} {update} title="Content Alignment" id="content-alignment" styleName="textAlign" />
<Styles {update} {updatePageContentWithDebounce} />

<style>
.faq-item-editor {
  min-width: 0;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--ui-border, #444);
  border-radius: 6px;
  background: var(--ui-panel, #2c2c2c);
}

.faq-item-heading {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.faq-item-badge {
  margin-right: auto;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
  font-weight: 500;
}

.faq-item-order {
  display: flex;
  gap: 2px;
}

.faq-hint {
  margin: 0 0 12px;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
  line-height: 1.5;
}
</style>
