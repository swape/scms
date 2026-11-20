<script lang="ts">
import { onDestroy } from 'svelte'
import Button from '../../components/Button.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import Textarea from '../../components/Textarea.svelte'
import { currentProject } from '../../store.ts'
import type { BlockEditorProps, FooterElement, ProjectType, SocialPlatform } from '../../types/types.ts'
import { createPendingSave } from '../../utils/editor-save.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import { createFooterHtml, createFooterLink, createFooterSocial, createFooterText, saveFooterToProject } from '../../utils/footer.ts'

const { activeTab = 'content' }: BlockEditorProps = $props()
const style = getStyleEditor()

let project = $state<ProjectType | null>(null)
let elements = $state<FooterElement[]>([])
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
    }
  }
})

function captureSave() {
  const target = $currentProject
  if (!target || target.id !== loadedId) {
    return
  }
  const originalFooter = target.footer
  const editedFooter = { ...originalFooter, elements: cloneFooterElements(elements) }
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
  <h2 class="footer-title">Footer for {project.title}</h2>

  <div hidden={activeTab !== 'style'}>
    <PanelSection title="Appearance" class="footer-section">
      <Select
        label="Footer style"
        wrapperClass="footer-field"
        class="footer-select"
        value={style.read('footerType') ?? 'footer1'}
        onchange={(event) => style.set('footerType', event.currentTarget.value)}>
        <option value="footer1">Style 1</option>
      </Select>
    </PanelSection>
  </div>

  <div hidden={activeTab !== 'content'}>
    <PanelSection title="Elements" class="footer-section">
      {#each elements as el, index (el.id)}
        <div class="footer-element">
          <div class="footer-element-heading">
            <span class="element-badge">{el.type}</span>
            <div class="footer-element-order">
              <Button
                class="footer-icon-button"
                icon="arrow_upward"
                iconOnly
                variant="ghost"
                size="sm"
                aria-label={`Move ${el.title} up`}
                title={`Move ${el.title} up`}
                disabled={index === 0}
                onclick={() => moveElement(index, -1)} />
              <Button
                class="footer-icon-button"
                icon="arrow_downward"
                iconOnly
                variant="ghost"
                size="sm"
                aria-label={`Move ${el.title} down`}
                title={`Move ${el.title} down`}
                disabled={index === elements.length - 1}
                onclick={() => moveElement(index, 1)} />
            </div>
            <Button class="footer-remove" icon="delete" iconOnly variant="ghost" size="sm" aria-label="Remove" title={`Remove ${el.title}`} onclick={() => removeElement(el.id)} />
          </div>

          {#if el.type === 'link'}
            <Input
              label="Label"
              wrapperClass="footer-field"
              class="w-full"
              placeholder="Label"
              value={el.title}
              oninput={(event) => updateElementField(el.id, 'title', event.currentTarget.value)} />
            {#if el.link}
              <Input
                label="URL"
                wrapperClass="footer-field"
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
                wrapperClass="footer-field"
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
              wrapperClass="footer-field"
              class="w-full"
              placeholder="Text content (e.g. © 2024 My Company)"
              value={el.text}
              oninput={(event) => updateElementField(el.id, 'text', event.currentTarget.value)} />
          {/if}

          {#if el.type === 'html'}
            <Textarea
              id={`footer-html-${el.id}`}
              label="Custom HTML"
              rows="4"
              placeholder="Custom HTML"
              value={el.html}
              oninput={(event) => updateElementField(el.id, 'html', event.currentTarget.value)} />
          {/if}
        </div>
      {/each}

      {#if elements.length === 0}
        <p class="empty-hint">No elements yet. Add some below.</p>
      {/if}
    </PanelSection>

    <PanelSection title="Add element" class="footer-section">
      <div class="add-row">
        <Button icon="add" onclick={addLink}>Link</Button>
        <Button icon="add" onclick={addText}>Text</Button>
        <Button icon="add" onclick={addHtml}>Custom HTML</Button>
      </div>
      <div class="add-row social-add-row">
        <span class="social-label">Social:</span>
        {#each socialPlatforms as platform}
          <Button onclick={() => addSocial(platform)}>{platform}</Button>
        {/each}
      </div>
    </PanelSection>
  </div>
{/if}

<style>
.footer-title {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ui-text, #f5f5f5);
}

.footer-element {
  display: grid;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 0.0625rem solid var(--ui-border, #444);
  border-radius: 0.375rem;
  background: var(--ui-panel, #2c2c2c);
}

.footer-element :global(.ui-field) {
  min-width: 0;
  margin: 0;
}

.footer-element-heading {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.footer-element-order {
  display: flex;
  gap: 0.125rem;
}

.element-badge {
  margin-right: auto;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.platform-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.empty-hint {
  margin: 0;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  line-height: 1.5;
}

.add-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.social-add-row {
  margin-top: 0.75rem;
}

.social-label {
  flex-basis: 100%;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
