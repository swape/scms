<script lang="ts">
import { onDestroy } from 'svelte'
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import { currentProject } from '../../store.ts'
import type { BlockEditorProps, FooterElement, ProjectType, SocialPlatform } from '../../types/types.ts'
import { createPendingSave } from '../../utils/editor-save.ts'
import { createFooterHtml, createFooterLink, createFooterSocial, createFooterText, saveFooterToProject } from '../../utils/footer.ts'

const {}: BlockEditorProps = $props()

let project = $state<ProjectType | null>(null)
let elements = $state<FooterElement[]>([])
let footerType = $state<'footer1'>('footer1')
let loadedId = $state<string | number | null>(null)
const pendingSave = createPendingSave(500)

onDestroy(pendingSave.flush)

function cloneFooterElements(source: FooterElement[]): FooterElement[] {
  return source.map((element) => ({
    ...element,
    ...(element.link && {
      link: {
        ...element.link,
        ...(element.link.style && { style: { ...element.link.style } }),
      },
    }),
  }))
}

$effect(() => {
  const found = $currentProject
  if (found) {
    project = found
    if (found.id !== loadedId) {
      loadedId = found.id
      elements = cloneFooterElements(found.footer?.elements ?? [])
      footerType = found.footer?.type ?? 'footer1'
    }
  }
})

function captureSave() {
  const target = $currentProject
  if (!target || target.id !== loadedId) {
    return
  }
  const originalFooter = target.footer
  const editedFooter = { ...originalFooter, type: footerType, elements: cloneFooterElements(elements) }
  return () => {
    const current = $currentProject
    if (current?.id === target.id && current.footer === originalFooter) {
      saveFooterToProject(current.id, editedFooter)
    }
  }
}

function save() {
  pendingSave.cancel()
  captureSave()?.()
}

function saveDebounced() {
  const callback = captureSave()
  if (callback) {
    pendingSave.schedule(callback)
  } else {
    pendingSave.cancel()
  }
}

function updateElementField(elementId: string, field: 'title' | 'text' | 'html' | 'linkUrl', value: string) {
  elements = elements.map((element) => {
    if (element.id !== elementId) {
      return element
    }

    if (field === 'linkUrl') {
      return element.link ? { ...element, link: { ...element.link, url: value } } : element
    }

    return { ...element, [field]: value }
  })
  saveDebounced()
}

function addLink() {
  elements = [...elements, createFooterLink()]
  save()
}

function addSocial(platform: SocialPlatform) {
  elements = [...elements, createFooterSocial(platform)]
  save()
}

function addText() {
  elements = [...elements, createFooterText()]
  save()
}

function addHtml() {
  elements = [...elements, createFooterHtml()]
  save()
}

function removeElement(elementId: string) {
  elements = elements.filter((el) => el.id !== elementId)
  save()
}

function moveElement(index: number, direction: -1 | 1) {
  const destination = index + direction
  if (destination < 0 || destination >= elements.length) {
    return
  }

  const reordered = [...elements]
  ;[reordered[index], reordered[destination]] = [reordered[destination], reordered[index]]
  elements = reordered
  save()
}

const socialPlatforms: SocialPlatform[] = ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube']
</script>

{#if project?.id}
  <h2 class="mb-5 text-2xl">Footer for {project.title}</h2>

  <div class="footer-section">
    <Select label="Footer style" wrapperClass="footer-field" class="footer-select" bind:value={footerType} onchange={save}>
      <option value="footer1">Style 1</option>
    </Select>
  </div>

  <div class="footer-section">
    <h3 class="footer-section-title">Elements</h3>

    {#each elements as el, index (el.id)}
      <div class="footer-element">
        <div class="footer-element-heading">
          <span class="element-badge">{el.type}</span>
          <div class="footer-element-order">
            <button
              type="button"
              class="footer-icon-button"
              aria-label={`Move ${el.title} up`}
              title={`Move ${el.title} up`}
              disabled={index === 0}
              onclick={() => moveElement(index, -1)}>
              <span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
            </button>
            <button
              type="button"
              class="footer-icon-button"
              aria-label={`Move ${el.title} down`}
              title={`Move ${el.title} down`}
              disabled={index === elements.length - 1}
              onclick={() => moveElement(index, 1)}>
              <span class="material-symbols-outlined" aria-hidden="true">arrow_downward</span>
            </button>
          </div>
          <button type="button" class="footer-remove" aria-label="Remove" title={`Remove ${el.title}`} onclick={() => removeElement(el.id)}>
            <span class="material-symbols-outlined" aria-hidden="true">delete</span>
          </button>
        </div>

        {#if el.type === 'link'}
          <Input
            label="Label"
            wrapperClass="grid min-w-[120px] flex-1 gap-1"
            class="w-full"
            placeholder="Label"
            value={el.title}
            oninput={(event) => updateElementField(el.id, 'title', event.currentTarget.value)} />
          {#if el.link}
            <Input
              label="URL"
              wrapperClass="grid min-w-[120px] flex-1 gap-1"
              class="w-full"
              type="url"
              placeholder="URL"
              value={el.link.url}
              oninput={(event) => updateElementField(el.id, 'linkUrl', event.currentTarget.value)} />
            <Select label="Open in" wrapperClass="footer-target-field" class="footer-select" bind:value={el.link.target} onchange={save}>
              <option value="_self">Same tab</option>
              <option value="_blank">New tab</option>
            </Select>
          {/if}
        {/if}

        {#if el.type === 'social'}
          <span class="platform-name">{el.socialPlatform}</span>
          {#if el.link}
            <Input
              label="Profile URL"
              wrapperClass="grid min-w-[120px] flex-1 gap-1"
              class="w-full"
              type="url"
              placeholder="Profile URL"
              value={el.link.url}
              oninput={(event) => updateElementField(el.id, 'linkUrl', event.currentTarget.value)} />
          {/if}
        {/if}

        {#if el.type === 'text'}
          <Input
            label="Text content"
            wrapperClass="grid min-w-[120px] flex-1 gap-1"
            class="w-full"
            placeholder="Text content (e.g. © 2024 My Company)"
            value={el.text}
            oninput={(event) => updateElementField(el.id, 'text', event.currentTarget.value)} />
        {/if}

        {#if el.type === 'html'}
          <textarea class="footer-textarea" placeholder="Custom HTML" value={el.html} oninput={(event) => updateElementField(el.id, 'html', event.currentTarget.value)}></textarea>
        {/if}
      </div>
    {/each}

    {#if elements.length === 0}
      <p class="empty-hint">No elements yet. Add some below.</p>
    {/if}
  </div>

  <div class="footer-section">
    <h3 class="footer-section-title">Add element</h3>
    <div class="add-row">
      <button type="button" class="btn p-2" onclick={addLink}>+ Link</button>
      <button type="button" class="btn p-2" onclick={addText}>+ Text</button>
      <button type="button" class="btn p-2" onclick={addHtml}>+ Custom HTML</button>
    </div>
    <div class="add-row mt-3">
      <span class="social-label">Social:</span>
      {#each socialPlatforms as platform}
        <button type="button" class="btn p-2" onclick={() => addSocial(platform)}>{platform}</button>
      {/each}
    </div>
  </div>
{/if}

<style>
.footer-section {
  margin-bottom: 1.5rem;
}

.footer-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.footer-section :global(.footer-field) {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-element :global(.footer-target-field) {
  display: grid;
  gap: 0.3rem;
}

.footer-element {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.7rem;
  margin-bottom: 0.55rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.045);
}

.footer-element-heading {
  display: flex;
  align-items: center;
  flex-basis: 100%;
  gap: 0.4rem;
}

.footer-element-order {
  display: flex;
  gap: 0.2rem;
}

.footer-icon-button,
.footer-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  border: 1px solid rgba(128, 128, 128, 0.45);
  border-radius: 3px;
  padding: 0.3rem 0.55rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.footer-icon-button:focus-visible,
.footer-remove:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.footer-icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.footer-remove {
  color: #dc2626;
}

.footer-textarea {
  flex: 1;
  min-height: 80px;
  width: 100%;
}

.element-badge {
  margin-right: auto;
  color: #2563eb;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
}

.platform-name {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 80px;
}

.empty-hint {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  font-size: 0.875rem;
}

.add-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.social-label {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
