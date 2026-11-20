<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import Input from '../../components/Input.svelte'
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
  <p class="mb-3 text-sm">Only the first question marked Open on start will start open.</p>
{/if}

<div class="faq-section">
  <h3>Questions and answers</h3>
  {#each items as item, index (item.id)}
    <div class="faq-item-editor">
      <div class="faq-item-heading">
        <span class="faq-item-badge">Question {index + 1}</span>
        <div class="faq-item-order">
          <button
            type="button"
            class="faq-icon-button"
            aria-label={`Move question ${index + 1} up`}
            title={`Move question ${index + 1} up`}
            disabled={index === 0}
            onclick={() => moveItem(index, -1)}>
            <span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
          </button>
          <button
            type="button"
            class="faq-icon-button"
            aria-label={`Move question ${index + 1} down`}
            title={`Move question ${index + 1} down`}
            disabled={index === items.length - 1}
            onclick={() => moveItem(index, 1)}>
            <span class="material-symbols-outlined" aria-hidden="true">arrow_downward</span>
          </button>
        </div>
        <button
          type="button"
          class="faq-icon-button faq-remove"
          aria-label={`Remove question ${index + 1}`}
          title={`Remove question ${index + 1}`}
          onclick={() => removeItem(item.id)}>
          <span class="material-symbols-outlined" aria-hidden="true">delete</span>
        </button>
      </div>
      <Input id={`faq-question-${item.id}`} label="Question:" value={item.question} oninput={(event) => updateItem(item.id, 'question', event.currentTarget.value)} />
      <div class="input-and-label-wrapper">
        <label for={`faq-answer-${item.id}`}>Answer:</label>
        <textarea id={`faq-answer-${item.id}`} rows="4" value={item.answer} oninput={(event) => updateItem(item.id, 'answer', event.currentTarget.value)}></textarea>
      </div>
      <Checkbox
        id={`faq-open-on-start-${item.id}`}
        label="Open on start"
        checked={Boolean(item.openOnStart)}
        oninput={(event) => updateItem(item.id, 'openOnStart', event.currentTarget.checked)} />
    </div>
  {:else}
    <p>No questions yet. Add a question below.</p>
  {/each}
  <button type="button" class="faq-add" onclick={addItem}>
    <span class="material-symbols-outlined" aria-hidden="true">add</span>
    Add question
  </button>
</div>

<TextAlign element={$selectedElement} {update} title="Content Alignment" id="content-alignment" styleName="textAlign" />
<Styles {update} {updatePageContentWithDebounce} />

<style>
.faq-section {
  margin-bottom: 1.5rem;
}

.faq-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.faq-item-editor {
  min-width: 0;
  padding: 0.7rem;
  margin-bottom: 0.55rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.045);
}

.faq-item-heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.65rem;
}

.faq-item-badge {
  margin-right: auto;
  color: #2563eb;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.faq-item-order {
  display: flex;
  gap: 0.2rem;
}

.faq-icon-button,
.faq-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-height: 2rem;
  border: 1px solid rgba(128, 128, 128, 0.45);
  border-radius: 3px;
  padding: 0.3rem 0.55rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.faq-icon-button:focus-visible,
.faq-add:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.faq-icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.faq-remove {
  color: #dc2626;
}
</style>
