<script lang="ts">
import { onDestroy, setContext } from 'svelte'
import { getDefaultLinkEditorSettings } from '../../blocks/shared/helpers.ts'
import { MOBILE_STYLE_MAX_WIDTH } from '../../constants.ts'
import { currentProject, selectedElement, selectedPage } from '../../store.ts'
import type { ContentType, PageType, SettingsTab, StyleEditor, StyleMode, StyleValue, StyleValues, TabOption } from '../../types/types.ts'
import { createPendingSave, flushPendingEdits } from '../../utils/editor-save.ts'
import { STYLE_EDITOR_CONTEXT } from '../../utils/editor-style.ts'
import { saveFooterToProject } from '../../utils/footer.ts'
import { saveMenuToProject } from '../../utils/menu.ts'
import Button from '../Button.svelte'
import Icon from '../Icon.svelte'
import PanelSection from '../PanelSection.svelte'
import Tabs from '../Tabs.svelte'
import { getEditorDefinition } from './elements-list.ts'

let isFloating = $state(false)
let panel: HTMLDivElement | undefined = $state()
let panelHeader: HTMLDivElement | undefined = $state()
let floatingPosition = $state<{ left: number; top: number } | null>(null)
let isDragging = $state(false)
let drag: { pointerId: number; offsetX: number; offsetY: number; width: number; height: number; handle: HTMLButtonElement } | null = null

const tabsId = $props.id()
const tabs: readonly TabOption<SettingsTab>[] = [
  { value: 'content', label: 'Content' },
  { value: 'style', label: 'Style' },
  { value: 'other', label: 'Other settings' },
]
let activeTab = $state<SettingsTab>('content')
let selectionKey = ''
const styleTabsId = `${tabsId}-styles`
const styleTabs: readonly TabOption<StyleMode>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'mobile', label: 'Mobile overrides' },
]
let styleMode = $state<StyleMode>('normal')

const normalStyle = $derived.by((): StyleValues => {
  const element = $selectedElement
  if (element?.type === 'menu') {
    return { ...$currentProject?.menu.style }
  }
  if (element?.type === 'footer') {
    return { footerType: $currentProject?.footer.type ?? 'footer1' }
  }
  if (element && 'parentId' in element) {
    return { ...element.colors }
  }
  if (element && 'pageId' in element) {
    return { ...element.style, ...element.link?.style, asButton: Boolean(element.link?.asButton), flipped: Boolean(element.flipped) }
  }
  return {}
})
const mobileStyle = $derived.by((): StyleValues => {
  const element = $selectedElement
  if (element?.type === 'menu') {
    return $currentProject?.menu.mobileStyle ?? {}
  }
  if (element?.type === 'footer') {
    return $currentProject?.footer.mobileStyle ?? {}
  }
  return element && 'order' in element ? (element.mobileStyle ?? {}) : {}
})
const effectiveStyle = $derived.by((): StyleValues => {
  if (styleMode === 'normal') {
    return normalStyle
  }
  const values = { ...normalStyle, ...mobileStyle }
  if (values.paddingMode === 'individual' && normalStyle.paddingMode !== 'individual') {
    for (const key of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
      if (!(key in mobileStyle)) {
        if (normalStyle.paddingAll === undefined) {
          delete values[key]
        } else {
          values[key] = normalStyle.paddingAll
        }
      }
    }
  } else if (values.paddingMode !== 'individual' && normalStyle.paddingMode === 'individual' && !('paddingAll' in mobileStyle)) {
    delete values.paddingAll
  }
  return values
})
const overrideCount = $derived(Object.keys(mobileStyle).length)

function savePageStyle(changes: Partial<PageType>) {
  const project = $currentProject
  const element = $selectedElement
  if (!project || !element || !('parentId' in element)) {
    return
  }
  const page = project.pages.find((item) => item.id === element.id)
  if (!page) {
    return
  }
  const updated = { ...page, ...changes }
  currentProject.set({ ...project, pages: project.pages.map((item) => (item === page ? updated : item)) })
  selectedElement.set(updated)
  if ($selectedPage?.id === updated.id) {
    selectedPage.set(updated)
  }
}

function saveMobileStyle(value: StyleValues | undefined) {
  const element = $selectedElement
  const project = $currentProject
  if (!element || !project) {
    return
  }
  if (element.type === 'menu') {
    saveMenuToProject(project.id, { ...project.menu, mobileStyle: value })
  } else if (element.type === 'footer') {
    saveFooterToProject(project.id, { ...project.footer, mobileStyle: value })
  } else if ('parentId' in element) {
    savePageStyle({ mobileStyle: value })
  } else {
    update('mobileStyle', value)
  }
}

function setStyleField(key: string, value: StyleValue | undefined) {
  flushPendingEdits()
  const element = $selectedElement
  const project = $currentProject
  if (!element || !project) {
    return
  }
  if (styleMode === 'mobile') {
    const overrides = { ...mobileStyle }
    if (value === undefined) {
      delete overrides[key]
    } else {
      overrides[key] = value
    }
    saveMobileStyle(Object.keys(overrides).length ? overrides : undefined)
    return
  }
  if (element.type === 'menu') {
    const style = { ...project.menu.style }
    if (key === 'layout' && (value === 'horizontal' || value === 'vertical')) {
      style.layout = value
    } else if (key === 'backgroundColor' || key === 'textColor') {
      style[key] = typeof value === 'string' ? value : undefined
    }
    saveMenuToProject(project.id, { ...project.menu, style })
    return
  }
  if (element.type === 'footer') {
    if (key === 'footerType' && value === 'footer1') {
      saveFooterToProject(project.id, { ...project.footer, type: value })
    }
    return
  }
  if ('parentId' in element) {
    if (key === 'backgroundColorKey' || key === 'textColorKey') {
      savePageStyle({ colors: { textColorKey: '', backgroundColorKey: '', ...element.colors, [key]: typeof value === 'string' ? value : '' } })
    }
    return
  }
  if (!('pageId' in element)) {
    return
  }
  if (key === 'flipped') {
    update('flipped', Boolean(value))
  } else if (key === 'asButton' || key === 'buttonColor' || key === 'buttonTextColor') {
    const link = { ...(element.link ?? getDefaultLinkEditorSettings(project.pages[0]?.id ?? '')) }
    if (key === 'asButton') {
      link.asButton = Boolean(value)
    } else {
      link.style = { ...link.style }
      if (value === undefined) {
        delete link.style[key]
      } else if (typeof value !== 'boolean') {
        link.style[key] = value
      }
    }
    update('link', link)
  } else {
    const style = { ...element.style }
    if (value === undefined) {
      delete style[key]
    } else if (typeof value !== 'boolean') {
      style[key] = value
    }
    update('style', style)
  }
}

function changeStyleMode(mode: StyleMode) {
  flushPendingEdits()
  styleMode = mode
}

function resetMobileStyles() {
  flushPendingEdits()
  saveMobileStyle(undefined)
}

setContext<StyleEditor>(STYLE_EDITOR_CONTEXT, {
  get mode() {
    return styleMode
  },
  read(key) {
    const value = effectiveStyle[key]
    return typeof value === 'boolean' ? undefined : value
  },
  checked(key) {
    return effectiveStyle[key] === true
  },
  set: setStyleField,
})

function changeTab(tab: SettingsTab) {
  activeTab = tab
  panel?.scrollTo({ top: 0 })
}

function placeFloatingPanel(left: number, top: number, width: number, height: number) {
  // Pointer, viewport and DOM bounds use CSS pixels; only the stored position uses rem.
  const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  const inset = rootFontSize
  const maxLeft = Math.max(inset, window.innerWidth - width - inset)
  const maxTop = Math.max(inset, window.innerHeight - height - inset)
  floatingPosition ??= { left: 0, top: 0 }
  floatingPosition.left = Math.max(inset, Math.min(left, maxLeft)) / rootFontSize
  floatingPosition.top = Math.max(inset, Math.min(top, maxTop)) / rootFontSize
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
  placeFloatingPanel(bounds.left, bounds.top, bounds.width, bounds.height)
  if (drag) {
    drag.width = bounds.width
    drag.height = bounds.height
  }
}

$effect(() => {
  if (!isFloating || !panel || !panelHeader) {
    return
  }
  const observer = new ResizeObserver(keepPanelInView)
  observer.observe(panel)
  // The rem-sized header also detects root-font changes when the panel is viewport-constrained.
  observer.observe(panelHeader)
  return () => observer.disconnect()
})

function moveWithKeyboard(event: KeyboardEvent) {
  if (!isFloating || !panel) {
    return
  }
  // Keep the existing keyboard increments in the browser's CSS-pixel coordinate space.
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
  const key = element ? `${element.type}:${'pageId' in element ? element.pageId : ''}:${element.id}` : ''
  if (key !== selectionKey) {
    selectionKey = key
    styleMode = 'normal'
    changeTab('content')
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
  style:left={isFloating && floatingPosition ? `${floatingPosition.left}rem` : undefined}
  style:top={isFloating && floatingPosition ? `${floatingPosition.top}rem` : undefined}
  role="region"
  aria-label="Settings">
  <div bind:this={panelHeader} class="settings-header">
    <div class="settings-heading-row">
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
      <Tabs id={tabsId} label="Settings sections" options={tabs} value={activeTab} onvaluechange={changeTab} />
    {/if}
  </div>
  {#if $selectedElement}
    <div class="selection-info">
      <div class="selection-name">
        <Icon name={definition?.icon ?? 'crop_square'} />
        <strong>{$selectedElement.title || definition?.name}</strong>
        <span class="selection-type">{definition?.name ?? $selectedElement.type}</span>
      </div>
    </div>
    <div class="settings-content" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-tab-${activeTab}`} tabindex="0">
      <div class="style-mode-controls" hidden={activeTab !== 'style'}>
        <Tabs id={styleTabsId} label="Style mode" options={styleTabs} value={styleMode} onvaluechange={changeStyleMode} />
        <div class="mobile-style-note" hidden={styleMode !== 'mobile'}>
          <p>Applies at preview widths of {MOBILE_STYLE_MAX_WIDTH}px and below. Unchanged values inherit Normal styles.</p>
          <Button variant="ghost" icon="restart_alt" disabled={overrideCount === 0} onclick={resetMobileStyles}>Reset mobile overrides</Button>
        </div>
      </div>
      <div
        role={activeTab === 'style' ? 'tabpanel' : undefined}
        id={`${styleTabsId}-panel`}
        aria-labelledby={activeTab === 'style' ? `${styleTabsId}-tab-${styleMode}` : undefined}>
        {#if editorModule}
          {#await editorModule}
            <p role="status">Loading block editor...</p>
          {:then module}
            <module.default {activeTab} {updatePageContentWithDebounce} {update} />
          {:catch error}
            <p role="alert">Could not load block editor: {error instanceof Error ? error.message : String(error)}</p>
          {/await}
        {:else}
          <p role="alert">No editor registered for block type: {$selectedElement.type}</p>
        {/if}
      </div>
      <div hidden={activeTab !== 'other'}>
        <PanelSection title="Details">
          <p>Type: {definition?.name ?? $selectedElement.type}</p>
          <p class="selection-id">ID: {$selectedElement.id}</p>
        </PanelSection>
      </div>
    </div>
  {:else}
    <div class="panel-empty">
      <Icon name="touch_app" size={1.75} />
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
  padding: 0.5rem 0.5rem 0;
  z-index: 2;
  border-radius: 0.75rem 0.75rem 0 0;
  border-bottom: 0.0625rem solid var(--ui-border);
  background: var(--ui-panel);
}

.settings-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.settings-content :global([hidden]) {
  display: none;
}

.settings-content:focus-visible {
  outline: 0.125rem solid var(--ui-accent);
  outline-offset: -0.125rem;
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
  font-size: 0.625rem;
  font-weight: 400;
}
.selection-info {
  padding: 0.875rem 1rem;
  border-bottom: 0.0625rem solid var(--ui-border);
}
.selection-name {
  display: flex;
  gap: 0.5rem;
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
  font-size: 0.625rem;
}
.selection-id {
  display: block;
  margin-top: 0.25rem;
  color: var(--ui-muted);
  font-size: 0.625rem;
}
.settings-content {
  padding: 1rem;
}

.style-mode-controls {
  margin-bottom: 1rem;
}
.mobile-style-note {
  padding-top: 0.75rem;
  color: var(--ui-muted);
  font-size: 0.6875rem;
}
.mobile-style-note p {
  margin-bottom: 0.5rem;
}
.panel-empty p {
  margin-top: 0.75rem;
}

.settings-floating {
  --floating-panel-height: min(60dvh, 42rem);
  position: fixed;
  position-anchor: --editor-workspace;
  top: clamp(1rem, anchor(top, 1rem), calc(100dvh - var(--floating-panel-height) - 1rem));
  right: 1rem;
  height: var(--floating-panel-height);
  z-index: 20;
  width: min(23.75rem, calc(100vw - 2rem));
  min-width: min(17.5rem, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  max-height: calc(100dvh - 2rem);
  border: 0.0625rem solid var(--ui-border);
  border-radius: 0.75rem;
  box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 45%);
}

.settings-floating.settings-moved {
  position-anchor: auto;
  right: auto;
}
</style>
