<script lang="ts">
import { onDestroy } from 'svelte'
import { removeStorage, saveStorage } from '../../localstorage.ts'
import { currentProject, isDarkMode, selectedPage } from '../../store.ts'
import { flushPendingEdits } from '../../utils/editor-save.ts'
import { parseProjectJson } from '../../utils/project-json.ts'

let path = $state('')
let fileInput: HTMLInputElement | undefined = $state()
let isLoadingJson = $state(false)
let jsonError = $state('')
let downloadUrl: string | undefined
let actionMenu: HTMLDivElement | undefined = $state()
let actionTrigger: HTMLButtonElement | undefined = $state()

function closeActionMenu() {
  actionMenu?.hidePopover()
  actionTrigger?.focus()
}

onDestroy(() => {
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl)
  }
})

function saveAsJson() {
  closeActionMenu()
  jsonError = ''
  try {
    flushPendingEdits()
    const project = $currentProject
    if (!project) {
      return
    }

    const json = JSON.stringify(project, null, 2)
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
    }
    downloadUrl = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = downloadUrl
    const filename =
      project.title
        .trim()
        .replace(/[^a-z0-9_-]+/gi, '-')
        .replace(/^-+|-+$/g, '') || 'project'
    link.download = `${filename}.json`
    document.body.append(link)
    link.click()
    link.remove()
  } catch (error) {
    jsonError = `Could not save JSON: ${error instanceof Error ? error.message : 'Please try again.'}`
  }
}

async function loadFromJson(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || isLoadingJson) {
    return
  }

  isLoadingJson = true
  jsonError = ''
  try {
    const project = parseProjectJson(await file.text())
    const confirmed = confirm(
      `Load "${project.title}" from "${file.name}"?\n\nThis replaces the current local draft. Use Save as JSON first to keep a backup.\n\nOnly load files you trust: custom HTML and scripts can run in the preview.`
    )
    if (!confirmed) {
      return
    }

    flushPendingEdits()
    saveStorage('currentProject', project)
    removeStorage('selectedElement')
    removeStorage('selectedPage')
    // Reload every editor, including cached menu/footer settings when the ID is unchanged.
    const query = new URLSearchParams({ p: String(project.id), local: 'true' })
    window.location.assign(`/editor?${query}`)
  } catch (error) {
    jsonError = `Could not load JSON: ${error instanceof Error ? error.message : 'Please try again.'}`
  } finally {
    isLoadingJson = false
  }
}

function toggleDarkMode() {
  isDarkMode.update((value) => !value)
}

function findParentTitle(pageId: string | null): string {
  if (!pageId || !$currentProject) {
    return ''
  }
  const project = $currentProject
  const page = project.pages.find((p) => p.id === pageId)
  if (!page) {
    return ''
  }

  return `${findParentTitle(page.parentId)}${page.title} / `
}

selectedPage.subscribe((page) => {
  path = page ? findParentTitle(page.id) : ''
})
</script>

<div class="flex flex-wrap gap-2 p-5 border-b border-gray-600 items-center justify-between">
  <div class="flex gap-2 items-center">
    <div>
      {$currentProject?.title || 'No project selected'}
    </div>

    <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[50vw]">
      {#if $selectedPage}
        <span class="text-gray-400">{path}</span>
      {/if}
    </div>
  </div>
  <button class="top-menu-button btn" onclick={toggleDarkMode}>
    <span class="material-symbols-outlined">dark_mode</span>
    <span>Toggle Dark Mode</span>
  </button>

  <div class="save-load-actions">
    <button bind:this={actionTrigger} type="button" class="top-menu-button btn save-load-trigger" popovertarget="save-load-menu" aria-controls="save-load-menu">
      <span class="material-symbols-outlined" aria-hidden="true">save</span>
      <span>Save &amp; load</span>
      <span class="material-symbols-outlined dropdown-chevron" aria-hidden="true">expand_more</span>
    </button>

    <div bind:this={actionMenu} popover id="save-load-menu" class="save-load-menu" role="group" aria-label="Save and load actions" aria-busy={isLoadingJson}>
      <section class="save-load-group" aria-labelledby="server-actions-title">
        <h3 id="server-actions-title" class="save-load-group-title">
          <span class="material-symbols-outlined" aria-hidden="true">cloud</span>
          Server
        </h3>
        <button
          type="button"
          class="save-load-item"
          onclick={() => {
            closeActionMenu()
            alert('Save functionality not implemented yet')
          }}>
          <span class="material-symbols-outlined" aria-hidden="true">cloud_upload</span>
          <span>Save to server</span>
        </button>
        <button
          type="button"
          class="save-load-item"
          onclick={() => {
            closeActionMenu()
            alert('Save functionality not implemented yet')
          }}>
          <span class="material-symbols-outlined" aria-hidden="true">publish</span>
          <span>Save and Publish</span>
        </button>
      </section>

      <section class="save-load-group" aria-labelledby="json-actions-title">
        <h3 id="json-actions-title" class="save-load-group-title">
          <span class="material-symbols-outlined" aria-hidden="true">data_object</span>
          JSON files
        </h3>
        <button type="button" class="save-load-item" disabled={!$currentProject || isLoadingJson} onclick={saveAsJson}>
          <span class="material-symbols-outlined" aria-hidden="true">download</span>
          <span>Save as JSON</span>
        </button>
        <button
          type="button"
          class="save-load-item"
          disabled={isLoadingJson}
          onclick={() => {
            closeActionMenu()
            fileInput?.click()
          }}>
          <span class="material-symbols-outlined" aria-hidden="true">upload_file</span>
          <span>{isLoadingJson ? 'Loading JSON…' : 'Load from JSON'}</span>
        </button>
      </section>
    </div>
  </div>
  <input bind:this={fileInput} type="file" accept=".json,application/json" aria-label="Project JSON file" hidden onchange={loadFromJson} />
  {#if jsonError}
    <p role="alert" class="w-full text-red-300">{jsonError}</p>
  {/if}
</div>

<style>
.save-load-menu {
  position-area: bottom span-left;
  position-try-fallbacks: flip-inline, flip-block;
  margin: 0.5rem 0 0;
  width: min(18rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 0.4rem;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  background: #0f172a;
  color: #f8fafc;
  box-shadow: 0 12px 30px rgb(0 0 0 / 35%);
}

.save-load-group + .save-load-group {
  margin-top: 0.4rem;
  padding-top: 0.4rem;
  border-top: 1px solid #334155;
}

.save-load-group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.save-load-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.3rem;
  text-align: left;
  font-size: 0.875rem;
}

.save-load-item:hover:not(:disabled) {
  background: #1e293b;
}

.save-load-item:focus-visible,
.save-load-trigger:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: -2px;
}

.save-load-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.save-load-actions:has(:popover-open) .dropdown-chevron {
  transform: rotate(180deg);
}
</style>
