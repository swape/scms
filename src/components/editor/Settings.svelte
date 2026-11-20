<script lang="ts">
import { onDestroy } from 'svelte'
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType } from '../../types/types.ts'
import { createPendingSave } from '../../utils/editor-save.ts'
import Button from '../Button.svelte'
import Icon from '../Icon.svelte'
import { getEditorDefinition } from './elements-list.ts'

let isFloating = $state(false)
let panel: HTMLDivElement | undefined = $state()
let floatingPosition = $state<{ left: number; top: number } | null>(null)
let isDragging = $state(false)
let drag: { pointerId: number; offsetX: number; offsetY: number; width: number; height: number; handle: HTMLButtonElement } | null = null

function placeFloatingPanel(left: number, top: number, width: number, height: number) {
  const boundedHeight = Math.min(height, window.innerHeight - 32)
  floatingPosition ??= { left: 0, top: 0 }
  floatingPosition.left = Math.max(16, Math.min(left, window.innerWidth - width - 16))
  floatingPosition.top = Math.max(16, Math.min(top, window.innerHeight - boundedHeight - 16))
}

function startDrag(event: PointerEvent) {
  if (!isFloating || !panel || event.button !== 0 || !event.isPrimary) {
    return
  }
  const bounds = panel.getBoundingClientRect()
  const handle = event.currentTarget as HTMLButtonElement
  drag = {
    pointerId: event.pointerId,
    offsetX: event.clientX - bounds.left,
    offsetY: event.clientY - bounds.top,
    width: bounds.width,
    height: bounds.height,
    handle,
  }
  placeFloatingPanel(bounds.left, bounds.top, bounds.width, bounds.height)
  handle.setPointerCapture(event.pointerId)
  handle.focus()
  isDragging = true
  event.preventDefault()
}

function moveDrag(event: PointerEvent) {
  if (!drag || event.pointerId !== drag.pointerId) {
    return
  }
  placeFloatingPanel(event.clientX - drag.offsetX, event.clientY - drag.offsetY, drag.width, drag.height)
}

function finishDrag(event?: PointerEvent) {
  if (!drag || (event && event.pointerId !== drag.pointerId)) {
    return
  }
  const active = drag
  drag = null
  isDragging = false
  if (active.handle.hasPointerCapture(active.pointerId)) {
    active.handle.releasePointerCapture(active.pointerId)
  }
}

function toggleFloating() {
  finishDrag()
  isFloating = !isFloating
  if (!isFloating) {
    floatingPosition = null
  }
}

function keepPanelInView() {
  if (!isFloating || !floatingPosition || !panel) {
    return
  }
  const bounds = panel.getBoundingClientRect()
  placeFloatingPanel(floatingPosition.left, floatingPosition.top, bounds.width, bounds.height)
  if (drag) {
    drag.width = bounds.width
    drag.height = bounds.height
  }
}

function moveWithKeyboard(event: KeyboardEvent) {
  if (!isFloating || !panel) {
    return
  }
  const step = event.shiftKey ? 50 : 10
  let horizontal = 0
  let vertical = 0
  switch (event.key) {
    case 'ArrowLeft':
      horizontal = -step
      break
    case 'ArrowRight':
      horizontal = step
      break
    case 'ArrowUp':
      vertical = -step
      break
    case 'ArrowDown':
      vertical = step
      break
    default:
      return
  }
  event.preventDefault()
  const bounds = panel.getBoundingClientRect()
  placeFloatingPanel(bounds.left + horizontal, bounds.top + vertical, bounds.width, bounds.height)
}
const definition = $derived($selectedElement ? getEditorDefinition($selectedElement.type) : undefined)
const editorModule = $derived(definition?.editor())

// Updating a single key value for the selected element.
function update(key: string, value: unknown) {
  if ($selectedElement?.type === 'footer' || $selectedElement?.type === 'menu') {
    return
  }
  selectedElement.update((element) => {
    if (element) {
      // @ts-expect-error update the property dynamically
      ;(element as ContentType)[key] = value
    }
    return element
  })
  updatePageContentWithDebounce()
}

const pendingSave = createPendingSave(300)
let pendingElement: ContentType | null = null

const unsubscribeSelection = selectedElement.subscribe((element) => {
  if (
    pendingElement &&
    (!element || !('pageId' in element) || element.id !== pendingElement.id || element.pageId !== pendingElement.pageId || element.type !== pendingElement.type)
  ) {
    pendingSave.flush()
  }
})

onDestroy(() => {
  finishDrag()
  unsubscribeSelection()
  pendingSave.flush()
})

function updatePageContentWithDebounce() {
  const project = $currentProject
  const element = $selectedElement
  const page = project?.pages.find((candidate) => candidate.id === $selectedPage?.id)
  if (!project || !page || !element || !('pageId' in element)) {
    return
  }
  const original = page.content.find((candidate) => candidate.id === element.id)
  if (!original) {
    return
  }

  pendingElement = element
  const editedElement = { ...element }
  pendingSave.schedule(() => {
    pendingElement = null
    const current = $currentProject
    if (current?.id !== project.id || !current.pages.includes(page) || !page.content.includes(original)) {
      return
    }

    const updatedPage = {
      ...page,
      content: page.content.map((candidate) => (candidate === original ? { ...candidate, ...editedElement } : candidate)),
    }
    currentProject.set({ ...current, pages: current.pages.map((candidate) => (candidate === page ? updatedPage : candidate)) })
    if ($selectedPage?.id === page.id) {
      selectedPage.set(updatedPage)
    }
  })
}
</script>

<svelte:window onresize={keepPanelInView} />

<div
  bind:this={panel}
  class="settings editor-panel"
  class:settings-floating={isFloating}
  class:settings-moved={isFloating && floatingPosition !== null}
  class:settings-dragging={isDragging}
  style:left={isFloating && floatingPosition ? `${floatingPosition.left}px` : undefined}
  style:top={isFloating && floatingPosition ? `${floatingPosition.top}px` : undefined}
  role="region"
  aria-label="Settings">
  <div class="settings-header">
    <h2 class="settings-drag-heading">
      <Button
        variant="ghost"
        class="settings-drag-handle"
        disabled={!isFloating}
        aria-label={isFloating ? 'Move settings panel' : 'Settings panel is pinned'}
        title={isFloating ? 'Drag to move. Arrow keys move the panel; Shift moves faster.' : undefined}
        onpointerdown={startDrag}
        onpointermove={moveDrag}
        onpointerup={finishDrag}
        onpointercancel={finishDrag}
        onlostpointercapture={finishDrag}
        onkeydown={moveWithKeyboard}>
        {#if isFloating}
          <Icon name="drag_indicator" />
        {/if}
        <span class="inspector-title">Design</span>
        <span class="panel-mode">{isFloating ? 'Floating' : 'Pinned'}</span>
      </Button>
    </h2>
    <Button
      variant="ghost"
      icon={isFloating ? 'push_pin' : 'open_in_new'}
      iconOnly
      title={isFloating ? 'Pin settings panel to side' : 'Float settings panel'}
      aria-label={isFloating ? 'Pin settings panel to side' : 'Float settings panel'}
      class="settings-pin-button"
      onclick={toggleFloating} />
  </div>
  {#if $selectedElement}
    <div class="selection-info">
      <div class="selection-name">
        <Icon name={definition?.icon ?? 'crop_square'} />
        <strong>{$selectedElement.title || definition?.name}</strong>
        <span class="selection-type">{definition?.name ?? $selectedElement.type}</span>
      </div>
      <span class="selection-id">ID: {$selectedElement.id}</span>
    </div>
    <div class="settings-content">
      {#if editorModule}
        {#await editorModule}
          <p role="status">Loading block editor...</p>
        {:then module}
          <module.default {updatePageContentWithDebounce} {update} />
        {:catch error}
          <p role="alert">Could not load block editor: {error instanceof Error ? error.message : String(error)}</p>
        {/await}
      {:else}
        <p role="alert">No editor registered for block type: {$selectedElement.type}</p>
      {/if}
    </div>
  {:else}
    <div class="panel-empty">
      <Icon name="touch_app" size={28} />
      <p>Select a page or block to edit its properties.</p>
    </div>
  {/if}
</div>

<style>
.settings {
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.settings-header {
  position: sticky;
  top: 0;
  padding: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-panel);
}

.settings-drag-heading {
  flex: 1;
  min-width: 0;
}

.settings :global(.settings-drag-handle) {
  width: 100%;
  justify-content: flex-start;
  touch-action: none;
  user-select: none;
  cursor: grab;
}

.settings :global(.settings-drag-handle:disabled) {
  cursor: default;
  opacity: 1;
}

.settings-dragging :global(.settings-drag-handle) {
  cursor: grabbing;
}
.inspector-title {
  font-weight: 600;
}
.panel-mode {
  margin-left: auto;
  color: var(--ui-muted);
  font-size: 10px;
  font-weight: 400;
}
.selection-info {
  padding: 14px 16px;
  border-bottom: 1px solid var(--ui-border);
}
.selection-name {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}
.selection-name strong {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
.selection-type {
  color: var(--ui-muted);
  font-size: 10px;
}
.selection-id {
  display: block;
  margin: 4px 0 0 24px;
  color: var(--ui-muted);
  font-size: 10px;
}
.settings-content {
  padding: 16px;
}
.panel-empty p {
  margin-top: 12px;
}

.settings-floating {
  --floating-panel-height: min(60dvh, 42rem);
  position: fixed;
  position-anchor: --editor-workspace;
  top: clamp(1rem, anchor(top, 1rem), calc(100dvh - var(--floating-panel-height) - 1rem));
  right: 1rem;
  height: var(--floating-panel-height);
  z-index: 20;
  width: min(380px, calc(100vw - 2rem));
  min-width: min(280px, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  max-height: calc(100dvh - 2rem);
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  box-shadow: 0 16px 40px rgb(0 0 0 / 45%);
}

.settings-floating.settings-moved {
  position-anchor: auto;
  right: auto;
}
</style>
