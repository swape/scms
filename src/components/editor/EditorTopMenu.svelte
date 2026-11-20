<script lang="ts">
import { onDestroy } from 'svelte'
import { removeStorage, saveStorage } from '../../localstorage.ts'
import { currentProject, isDarkMode, selectedPage } from '../../store.ts'
import { flushPendingEdits } from '../../utils/editor-save.ts'
import { parseProjectJson } from '../../utils/project-json.ts'
import Button from '../Button.svelte'
import Icon from '../Icon.svelte'

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

<div class="editor-toolbar">
  <div class="toolbar-breadcrumb">
    <div>
      {$currentProject?.title || 'No project selected'}
    </div>

    <div class="toolbar-path">
      {#if $selectedPage}
        <span class="text-gray-400">{path}</span>
      {/if}
    </div>
  </div>
  <Button variant="ghost" icon="dark_mode" onclick={toggleDarkMode}>Toggle dark mode</Button>

  <div class="save-load-actions">
    <Button bind:ref={actionTrigger} variant="primary" icon="save" class="save-load-trigger" popovertarget="save-load-menu" aria-controls="save-load-menu">
      <span>Save &amp; load</span>
      <span class="dropdown-chevron"><Icon name="expand_more" /></span>
    </Button>

    <div bind:this={actionMenu} popover id="save-load-menu" class="save-load-menu" role="group" aria-label="Save and load actions" aria-busy={isLoadingJson}>
      <section class="save-load-group" aria-labelledby="server-actions-title">
        <h3 id="server-actions-title" class="save-load-group-title">
          <Icon name="cloud" />
          Server
        </h3>
        <Button
          variant="ghost"
          fullWidth
          icon="cloud_upload"
          class="save-load-item"
          onclick={() => {
            closeActionMenu()
            alert('Save functionality not implemented yet')
          }}>
          Save to server
        </Button>
        <Button
          variant="ghost"
          fullWidth
          icon="publish"
          class="save-load-item"
          onclick={() => {
            closeActionMenu()
            alert('Save functionality not implemented yet')
          }}>
          Save and Publish
        </Button>
      </section>

      <section class="save-load-group" aria-labelledby="json-actions-title">
        <h3 id="json-actions-title" class="save-load-group-title">
          <Icon name="data_object" />
          JSON files
        </h3>
        <Button variant="ghost" fullWidth icon="download" class="save-load-item" disabled={!$currentProject || isLoadingJson} onclick={saveAsJson}>Save as JSON</Button>
        <Button
          variant="ghost"
          fullWidth
          icon="upload_file"
          class="save-load-item"
          disabled={isLoadingJson}
          onclick={() => {
            closeActionMenu()
            fileInput?.click()
          }}>
          {isLoadingJson ? 'Loading JSON…' : 'Load from JSON'}
        </Button>
      </section>
    </div>
  </div>
  <input bind:this={fileInput} type="file" accept=".json,application/json" aria-label="Project JSON file" hidden onchange={loadFromJson} />
  {#if jsonError}
    <p role="alert" class="w-full text-red-300">{jsonError}</p>
  {/if}
</div>

<style>
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  min-height: 48px;
  background: var(--ui-panel);
  border-bottom: 1px solid var(--ui-border);
}
.toolbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.toolbar-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 35vw;
  color: var(--ui-muted);
}
.save-load-menu {
  position-area: bottom span-left;
  position-try-fallbacks: flip-inline, flip-block;
  margin: 0.5rem 0 0;
  width: min(18rem, calc(100vw - 2rem));
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 0.4rem;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-panel);
  color: var(--ui-text);
  box-shadow: 0 12px 30px rgb(0 0 0 / 35%);
}

.save-load-group + .save-load-group {
  margin-top: 0.4rem;
  padding-top: 0.4rem;
  border-top: 1px solid var(--ui-border);
}

.save-load-group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  color: var(--ui-muted);
  font-size: 11px;
  font-weight: 600;
}

.save-load-menu :global(.save-load-item) {
  justify-content: flex-start;
}

.save-load-actions:has(:popover-open) .dropdown-chevron {
  transform: rotate(180deg);
}
</style>
