<script lang="ts">
import { projects } from '../../store.ts'
import type { LinkSettings, MenuElement, PageType, ProjectType } from '../../types/types.ts'
import { createMenuElement, saveMenuToProject } from '../../utils/menu.ts'

let { id } = $props<{ id: string | null }>()

interface MenuRow {
  element: MenuElement
  path: number[]
  depth: number
}

let project = $state<ProjectType | null>(null)
let elements = $state<MenuElement[]>([])
let menuStyle = $state<NonNullable<ProjectType['menu']['style']>>({ layout: 'horizontal' })
let loadedId = $state<string | number | null>(null)
let draggedPath = $state<number[] | null>(null)

$effect(() => {
  const found = $projects?.find((item) => String(item.id) === String(id))
  if (found && found.id !== loadedId) {
    project = found
    loadedId = found.id
    elements = found.menu?.elements ?? []
    menuStyle = { layout: 'horizontal', ...found.menu?.style }
  }
})

let rows = $derived(flattenItems(elements))

function flattenItems(items: MenuElement[], parentPath: number[] = []): MenuRow[] {
  return items.flatMap((element, index) => {
    const path = [...parentPath, index]
    const row = { element, path, depth: parentPath.length }
    return element.type === 'dropdown' ? [row, ...flattenItems(element.children ?? [], path)] : [row]
  })
}

function findParent(path: number[]): MenuElement | null {
  let items = elements
  let parent: MenuElement | null = null
  for (const index of path.slice(0, -1)) {
    parent = items[index] ?? null
    items = parent?.children ?? []
  }
  return parent
}

function updateListAtPath(items: MenuElement[], path: number[], update: (list: MenuElement[]) => MenuElement[]): MenuElement[] {
  if (path.length === 0) {
    return update([...items])
  }

  const [index, ...rest] = path
  return items.map((element, itemIndex) => {
    if (itemIndex !== index) {
      return element
    }
    return { ...element, children: updateListAtPath(element.children ?? [], rest, update) }
  })
}

function updateItem(path: number[], update: (element: MenuElement) => MenuElement) {
  elements = updateListAtPath(elements, path.slice(0, -1), (siblings) => siblings.map((element, index) => (index === path[path.length - 1] ? update(element) : element)))
  save()
}

function save() {
  if (project) {
    saveMenuToProject(project.id, { type: 'menu1', elements, style: menuStyle })
  }
}

function addItem(type: MenuElement['type'], parentPath: number[] = []) {
  elements = updateListAtPath(elements, parentPath, (siblings) => [...siblings, createMenuElement(type)])
  save()
}

function setItemType(path: number[], type: MenuElement['type']) {
  updateItem(path, (element) => ({ ...createMenuElement(type), title: element.title }))
}

function updateLink(path: number[], values: Partial<LinkSettings>) {
  updateItem(path, (element) => ({
    ...element,
    link: {
      text: element.title,
      mode: 'page',
      url: '',
      pageId: '',
      target: '_self',
      asButton: false,
      ...element.link,
      ...values,
    },
  }))
}

function removeItem(path: number[]) {
  elements = updateListAtPath(elements, path.slice(0, -1), (siblings) => siblings.filter((_, index) => index !== path[path.length - 1]))
  save()
}

function moveItem(path: number[], direction: -1 | 1) {
  const index = path[path.length - 1]
  elements = updateListAtPath(elements, path.slice(0, -1), (siblings) => {
    const destination = index + direction
    if (destination < 0 || destination >= siblings.length) {
      return siblings
    }
    ;[siblings[index], siblings[destination]] = [siblings[destination], siblings[index]]
    return siblings
  })
  save()
}

function dropItem(event: DragEvent, targetPath: number[]) {
  event.preventDefault()
  const sourcePath = draggedPath
  draggedPath = null
  if (!sourcePath || sourcePath.length !== targetPath.length || sourcePath.slice(0, -1).some((part, index) => part !== targetPath[index])) {
    return
  }

  const sourceIndex = sourcePath[sourcePath.length - 1]
  const targetIndex = targetPath[targetPath.length - 1]
  if (sourceIndex === targetIndex) {
    return
  }

  elements = updateListAtPath(elements, targetPath.slice(0, -1), (siblings) => {
    const [moved] = siblings.splice(sourceIndex, 1)
    siblings.splice(targetIndex > sourceIndex ? targetIndex - 1 : targetIndex, 0, moved)
    return siblings
  })
  save()
}

function updateStyle(key: 'layout' | 'backgroundColor' | 'textColor', value: string) {
  menuStyle = { ...menuStyle, [key]: value }
  save()
}

function pageName(pageId: string, pages: PageType[]): string {
  return pages.find((page) => page.id === pageId)?.title ?? ''
}
</script>

{#if project}
  <h2 class="mb-5 text-2xl">Menu for {project.title}</h2>

  <section class="menu-section" aria-labelledby="menu-style-title">
    <h3 id="menu-style-title" class="menu-section-title">Appearance</h3>
    <div class="menu-style-fields">
      <label class="menu-field">
        <span>Layout</span>
        <select class="menu-select" value={menuStyle.layout ?? 'horizontal'} onchange={(event) => updateStyle('layout', event.currentTarget.value)}>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </label>
      <label class="menu-field">
        <span>Background</span>
        <input type="color" value={menuStyle.backgroundColor ?? '#ffffff'} onchange={(event) => updateStyle('backgroundColor', event.currentTarget.value)} />
      </label>
      <label class="menu-field">
        <span>Text</span>
        <input type="color" value={menuStyle.textColor ?? '#111827'} onchange={(event) => updateStyle('textColor', event.currentTarget.value)} />
      </label>
    </div>
  </section>

  <section class="menu-section" aria-labelledby="menu-items-title">
    <h3 id="menu-items-title" class="menu-section-title">Menu structure</h3>
    {#if rows.length === 0}
      <p class="menu-empty">No menu items yet.</p>
    {/if}

    <ol class="menu-items" aria-label="Menu items">
      {#each rows as row, index (row.element.id ?? row.path.join('-'))}
        <li
          class="menu-item"
          class:dragging={draggedPath?.join('.') === row.path.join('.')}
          style={`--menu-depth: ${row.depth}`}
          draggable="true"
          ondragstart={(event) => {
            draggedPath = row.path
            event.dataTransfer?.setData('text/plain', row.path.join('.'))
          }}
          ondragend={() => {
            draggedPath = null
          }}
          ondragover={(event) => event.preventDefault()}
          ondrop={(event) => dropItem(event, row.path)}>
          <div class="menu-item-heading">
            <span class="menu-item-kind">{row.element.type}</span>
            <div class="menu-item-order">
              <button
                type="button"
                class="menu-icon-button"
                aria-label={`Move ${row.element.title} up`}
                disabled={row.path[row.path.length - 1] === 0}
                onclick={() => moveItem(row.path, -1)}>Up</button>
              <button
                type="button"
                class="menu-icon-button"
                aria-label={`Move ${row.element.title} down`}
                disabled={row.path[row.path.length - 1] === (row.depth === 0 ? elements.length : (findParent(row.path)?.children?.length ?? 0)) - 1}
                onclick={() => moveItem(row.path, 1)}>Down</button>
            </div>
            <button type="button" class="menu-remove" onclick={() => removeItem(row.path)}>Remove</button>
          </div>

          <div class="menu-item-fields">
            <label class="menu-field">
              <span>Item type</span>
              <select class="menu-select" value={row.element.type} onchange={(event) => setItemType(row.path, event.currentTarget.value as MenuElement['type'])}>
                <option value="link">Link</option>
                <option value="dropdown">Manual submenu</option>
                <option value="auto">Automatic pages</option>
              </select>
            </label>
            <label class="menu-field menu-title-field">
              <span>Label</span>
              <input
                class="menu-input"
                type="text"
                value={row.element.title}
                oninput={(event) => updateItem(row.path, (element) => ({ ...element, title: event.currentTarget.value }))} />
            </label>

            {#if row.element.type === 'link'}
              <label class="menu-field">
                <span>Destination</span>
                <select
                  class="menu-select"
                  value={row.element.link?.mode ?? 'page'}
                  onchange={(event) => updateLink(row.path, { mode: event.currentTarget.value as LinkSettings['mode'] })}>
                  <option value="page">Project page</option>
                  <option value="url">External URL</option>
                </select>
              </label>
              {#if row.element.link?.mode === 'url'}
                <label class="menu-field menu-destination-field">
                  <span>URL</span>
                  <input
                    class="menu-input"
                    type="url"
                    placeholder="https://example.com"
                    value={row.element.link.url}
                    oninput={(event) => updateLink(row.path, { url: event.currentTarget.value })} />
                </label>
              {:else}
                <label class="menu-field menu-destination-field">
                  <span>Page</span>
                  <select class="menu-select" value={row.element.link?.pageId ?? ''} onchange={(event) => updateLink(row.path, { pageId: event.currentTarget.value })}>
                    <option value="">Choose a page</option>
                    {#each project.pages as page (page.id)}
                      <option value={page.id}>{page.title}</option>
                    {/each}
                  </select>
                </label>
              {/if}
              <label class="menu-field">
                <span>Open in</span>
                <select
                  class="menu-select"
                  value={row.element.link?.target ?? '_self'}
                  onchange={(event) => updateLink(row.path, { target: event.currentTarget.value as LinkSettings['target'] })}>
                  <option value="_self">Same tab</option>
                  <option value="_blank">New tab</option>
                </select>
              </label>
            {/if}

            {#if row.element.type === 'auto'}
              <label class="menu-field menu-destination-field">
                <span>List child pages of</span>
                <select
                  class="menu-select"
                  value={row.element.autoParentPageId ?? ''}
                  onchange={(event) => updateItem(row.path, (element) => ({ ...element, autoParentPageId: event.currentTarget.value }))}>
                  <option value="">Choose a parent page</option>
                  {#each project.pages as page (page.id)}
                    <option value={page.id}>{page.title}</option>
                  {/each}
                </select>
                {#if row.element.autoParentPageId}
                  <small>Current pages: {pageName(row.element.autoParentPageId, project.pages)}</small>
                {/if}
              </label>
              <label class="menu-field">
                <span>Maximum items</span>
                <input
                  class="menu-input menu-number"
                  type="number"
                  min="0"
                  value={row.element.autoMaxItems ?? 0}
                  oninput={(event) => updateItem(row.path, (element) => ({ ...element, autoMaxItems: Number(event.currentTarget.value) }))} />
                <small>0 lists every child page.</small>
              </label>
            {/if}
          </div>

          {#if row.element.type === 'dropdown'}
            <div class="menu-child-actions" aria-label={`Add item inside ${row.element.title}`}>
              <span>Submenu items</span>
              <button type="button" class="menu-add-button" onclick={() => addItem('link', row.path)}>+ Link</button>
              <button type="button" class="menu-add-button" onclick={() => addItem('dropdown', row.path)}>+ Submenu</button>
              <button type="button" class="menu-add-button" onclick={() => addItem('auto', row.path)}>+ Automatic pages</button>
            </div>
          {/if}
        </li>
      {/each}
    </ol>

    <div class="menu-add-actions" aria-label="Add menu item">
      <button type="button" class="menu-add-button" onclick={() => addItem('link')}>+ Link</button>
      <button type="button" class="menu-add-button" onclick={() => addItem('dropdown')}>+ Manual submenu</button>
      <button type="button" class="menu-add-button" onclick={() => addItem('auto')}>+ Automatic pages</button>
    </div>
  </section>
{/if}
<textarea>
  {JSON.stringify(project, null, 2)}
</textarea>

<style>
.menu-section {
  margin-bottom: 1.5rem;
}

.menu-section-title {
  margin-bottom: 0.65rem;
  font-size: 1rem;
  font-weight: 650;
}

.menu-style-fields,
.menu-item-fields,
.menu-add-actions,
.menu-child-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.65rem;
}

.menu-field {
  display: grid;
  gap: 0.3rem;
  min-width: 10rem;
  flex: 1;
  font-size: 0.8rem;
}

.menu-field input[type='color'] {
  width: 3rem;
  height: 2.1rem;
  padding: 0.15rem;
}

.menu-input,
.menu-select {
  width: 100%;
  min-width: 0;
  border: 1px solid rgba(128, 128, 128, 0.55);
  border-radius: 3px;
  padding: 0.45rem 0.55rem;
  background: transparent;
  color: inherit;
}

.menu-input:focus-visible,
.menu-select:focus-visible,
.menu-icon-button:focus-visible,
.menu-add-button:focus-visible,
.menu-remove:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.menu-items {
  display: grid;
  gap: 0.55rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu-item {
  min-width: 0;
  margin-inline-start: calc(var(--menu-depth) * 1.15rem);
  padding: 0.7rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 4px;
  background: rgba(128, 128, 128, 0.045);
}

.menu-item.dragging {
  opacity: 0.45;
}

.menu-item-heading {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}

.menu-item-kind {
  margin-right: auto;
  color: #2563eb;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.menu-item-order {
  display: flex;
  gap: 0.2rem;
}

.menu-icon-button,
.menu-remove,
.menu-add-button {
  min-height: 2rem;
  border: 1px solid rgba(128, 128, 128, 0.45);
  border-radius: 3px;
  padding: 0.3rem 0.55rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.menu-icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.menu-remove {
  color: #dc2626;
}

.menu-title-field,
.menu-destination-field {
  flex: 2;
}

.menu-number {
  max-width: 8rem;
}

.menu-field small {
  opacity: 0.7;
}

.menu-child-actions {
  margin-top: 0.65rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}

.menu-child-actions > span {
  margin-right: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.menu-empty {
  margin: 0 0 0.75rem;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .menu-field {
    min-width: min(100%, 12rem);
  }

  .menu-item {
    margin-inline-start: calc(var(--menu-depth) * 0.55rem);
    padding: 0.55rem;
  }
}
</style>
