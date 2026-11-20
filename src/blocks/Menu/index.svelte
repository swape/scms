<script lang="ts">
import Button from '../../components/Button.svelte'
import Checkbox from '../../components/Checkbox.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import { currentProject } from '../../store.ts'
import type { BlockEditorProps, LinkSettings, MenuElement, PageType, ProjectType } from '../../types/types.ts'
import { createMenuElement, saveMenuToProject } from '../../utils/menu.ts'
import ColorSelect from '../shared/ColorSelect.svelte'

const {}: BlockEditorProps = $props()

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
  const found = $currentProject
  if (found) {
    project = found
    if (found.id !== loadedId) {
      loadedId = found.id
      elements = found.menu?.elements ?? []
      menuStyle = { layout: 'horizontal', ...found.menu?.style }
    }
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

function updateStyle<Key extends keyof NonNullable<ProjectType['menu']['style']>>(key: Key, value: NonNullable<ProjectType['menu']['style']>[Key]) {
  menuStyle = { ...menuStyle, [key]: value }
  save()
}

function updateColor(key: 'backgroundColor' | 'textColor', event: Event) {
  const select = event.currentTarget as HTMLSelectElement
  updateStyle(key, select.value)
}

function pageName(pageId: string, pages: PageType[]): string {
  return pages.find((page) => page.id === pageId)?.title ?? ''
}
</script>

{#if project}
  <h2 class="menu-title">Menu for {project.title}</h2>

  <PanelSection title="Appearance" id="menu-style-title" class="menu-section">
    <div class="menu-style-fields">
      <Select
        label="Layout"
        wrapperClass="menu-field"
        class="menu-select"
        value={menuStyle.layout ?? 'horizontal'}
        onchange={(event) => updateStyle('layout', event.currentTarget.value as 'horizontal' | 'vertical')}>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </Select>
      <ColorSelect
        element={{ style: menuStyle }}
        title="Background color"
        id="menu-background-color"
        styleName="backgroundColor"
        update={(event: Event) => updateColor('backgroundColor', event)}
        isBgColors={true} />
      <ColorSelect
        element={{ style: menuStyle }}
        title="Text color"
        id="menu-text-color"
        styleName="textColor"
        update={(event: Event) => updateColor('textColor', event)}
        isBgColors={false} />
    </div>
    <Checkbox id="menu-sticky" label="Sticky menu" checked={Boolean(menuStyle.sticky)} oninput={(event) => updateStyle('sticky', event.currentTarget.checked)} />
  </PanelSection>

  <PanelSection title="Menu structure" id="menu-items-title" class="menu-section">
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
              <Button
                class="menu-icon-button"
                icon="arrow_upward"
                iconOnly
                variant="ghost"
                size="sm"
                aria-label={`Move ${row.element.title} up`}
                title={`Move ${row.element.title} up`}
                disabled={row.path[row.path.length - 1] === 0}
                onclick={() => moveItem(row.path, -1)} />
              <Button
                class="menu-icon-button"
                icon="arrow_downward"
                iconOnly
                variant="ghost"
                size="sm"
                aria-label={`Move ${row.element.title} down`}
                title={`Move ${row.element.title} down`}
                disabled={row.path[row.path.length - 1] === (row.depth === 0 ? elements.length : (findParent(row.path)?.children?.length ?? 0)) - 1}
                onclick={() => moveItem(row.path, 1)} />
            </div>
            <Button
              class="menu-remove"
              icon="delete"
              iconOnly
              variant="ghost"
              size="sm"
              aria-label="Remove"
              title={`Remove ${row.element.title}`}
              onclick={() => removeItem(row.path)} />
          </div>

          <div class="menu-item-fields">
            <Select
              label="Item type"
              wrapperClass="menu-field"
              class="menu-select"
              value={row.element.type}
              onchange={(event) => setItemType(row.path, event.currentTarget.value as MenuElement['type'])}>
              <option value="link">Link</option>
              <option value="dropdown">Manual submenu</option>
              <option value="auto">Automatic pages</option>
            </Select>
            <Input
              label="Label"
              wrapperClass="menu-field menu-title-field"
              class="menu-input"
              type="text"
              value={row.element.title}
              oninput={(event) => updateItem(row.path, (element) => ({ ...element, title: event.currentTarget.value }))} />

            {#if row.element.type === 'link'}
              <Select
                label="Destination"
                wrapperClass="menu-field"
                class="menu-select"
                value={row.element.link?.mode ?? 'page'}
                onchange={(event) => updateLink(row.path, { mode: event.currentTarget.value as LinkSettings['mode'] })}>
                <option value="page">Project page</option>
                <option value="url">External URL</option>
              </Select>
              {#if row.element.link?.mode === 'url'}
                <Input
                  label="URL"
                  wrapperClass="menu-field menu-destination-field"
                  class="menu-input"
                  type="url"
                  placeholder="https://example.com"
                  value={row.element.link.url}
                  oninput={(event) => updateLink(row.path, { url: event.currentTarget.value })} />
              {:else}
                <Select
                  label="Page"
                  wrapperClass="menu-field menu-destination-field"
                  class="menu-select"
                  value={row.element.link?.pageId ?? ''}
                  onchange={(event) => updateLink(row.path, { pageId: event.currentTarget.value })}>
                  <option value="">Choose a page</option>
                  {#each project.pages as page (page.id)}
                    <option value={page.id}>{page.title}</option>
                  {/each}
                </Select>
              {/if}
              <Select
                label="Open in"
                wrapperClass="menu-field"
                class="menu-select"
                value={row.element.link?.target ?? '_self'}
                onchange={(event) => updateLink(row.path, { target: event.currentTarget.value as LinkSettings['target'] })}>
                <option value="_self">Same tab</option>
                <option value="_blank">New tab</option>
              </Select>
            {/if}

            {#if row.element.type === 'auto'}
              <Select
                label="List child pages of"
                wrapperClass="menu-field menu-destination-field"
                hint={row.element.autoParentPageId ? `Current pages: ${pageName(row.element.autoParentPageId, project.pages)}` : undefined}
                class="menu-select"
                value={row.element.autoParentPageId ?? ''}
                onchange={(event) => updateItem(row.path, (element) => ({ ...element, autoParentPageId: event.currentTarget.value }))}>
                <option value="">Choose a parent page</option>
                {#each project.pages as page (page.id)}
                  <option value={page.id}>{page.title}</option>
                {/each}
              </Select>
              <Input
                label="Maximum items"
                wrapperClass="menu-field"
                hint="0 lists every child page."
                class="menu-input menu-number"
                type="number"
                min="0"
                value={row.element.autoMaxItems ?? 0}
                oninput={(event) => updateItem(row.path, (element) => ({ ...element, autoMaxItems: Number(event.currentTarget.value) }))} />
            {/if}
          </div>

          {#if row.element.type === 'dropdown'}
            <div class="menu-child-actions" aria-label={`Add item inside ${row.element.title}`}>
              <span>Submenu items</span>
              <Button class="menu-add-button" icon="add" onclick={() => addItem('link', row.path)}>Link</Button>
              <Button class="menu-add-button" icon="add" onclick={() => addItem('dropdown', row.path)}>Submenu</Button>
              <Button class="menu-add-button" icon="add" onclick={() => addItem('auto', row.path)}>Automatic pages</Button>
            </div>
          {/if}
        </li>
      {/each}
    </ol>

    <div class="menu-add-actions" aria-label="Add menu item">
      <Button class="menu-add-button" icon="add" onclick={() => addItem('link')}>Link</Button>
      <Button class="menu-add-button" icon="add" onclick={() => addItem('dropdown')}>Manual submenu</Button>
      <Button class="menu-add-button" icon="add" onclick={() => addItem('auto')}>Automatic pages</Button>
    </div>
  </PanelSection>
{/if}

<style>
.menu-title {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ui-text, #f5f5f5);
}

.menu-style-fields,
.menu-item-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 132px), 1fr));
  align-items: end;
  gap: 8px;
}

.menu-style-fields {
  margin-bottom: 12px;
}

.menu-style-fields :global(.ui-field),
.menu-item-fields :global(.ui-field) {
  min-width: 0;
  margin: 0;
}

.menu-item-fields :global(.menu-title-field),
.menu-item-fields :global(.menu-destination-field) {
  grid-column: 1 / -1;
}

.menu-add-actions,
.menu-child-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.menu-add-actions {
  margin-top: 12px;
}

.menu-items {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu-item {
  min-width: 0;
  margin-inline-start: min(calc(var(--menu-depth) * 12px), 36px);
  padding: 8px;
  border: 1px solid var(--ui-border, #444);
  border-radius: 6px;
  background: var(--ui-panel, #2c2c2c);
}

.menu-item.dragging {
  opacity: 0.45;
}

.menu-item-heading {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.menu-item-kind {
  margin-right: auto;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.menu-item-order {
  display: flex;
  gap: 2px;
}

.menu-child-actions {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--ui-border, #444);
}

.menu-child-actions > span {
  flex-basis: 100%;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
  font-weight: 500;
}

.menu-empty {
  margin: 0;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
  line-height: 1.5;
}
</style>
