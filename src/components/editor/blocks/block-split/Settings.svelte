<script lang="ts">
import { untrack } from 'svelte'
import { currentProject, selectedElement, selectedPage } from '../../../../store'
import type { ContentType } from '../../../../types/types'
import SelectWithLabel from '../../../editorParts/SelectWithLabel.svelte'
import { blockMeta } from '../blockMeta'

let { element, onChange } = $props()
let localElement = $state(untrack(() => ({ ...element })))

$effect(() => {
  localElement = { ...element }
})

function addBlockToColumn(blockType: string, columnIndex: number) {
  if (!$currentProject || !$selectedPage) return
  const def = blockMeta.find((b) => b.type === blockType)
  if (!def) return

  const oldContent = $currentProject.content || {}

  const alreadyHasBlock = Object.values(oldContent).some((c) => c.parent === String(element.id) && (c as ContentType & { columnIndex?: number }).columnIndex === columnIndex)
  if (alreadyHasBlock) return

  const newBlockId = Date.now()
  const newBlock = def.defaultData({
    id: newBlockId,
    order: 1,
    pageId: $selectedPage.id,
    parent: String(element.id),
    columnIndex,
  } as Partial<ContentType> & { columnIndex: number })

  currentProject.set({
    ...$currentProject,
    content: { ...oldContent, [newBlockId]: newBlock },
  })

  $selectedElement = newBlock
}

const columnOptions = [
  { value: '1', label: '1 Column' },
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
]

const gapOptions = [
  { value: 'split-gap-none', label: 'None' },
  { value: 'split-gap-sm', label: 'Small' },
  { value: 'split-gap-md', label: 'Medium' },
  { value: 'split-gap-lg', label: 'Large' },
  { value: 'split-gap-xl', label: 'Extra Large' },
]

const alignOptions = [
  { value: 'split-align-start', label: 'Top' },
  { value: 'split-align-center', label: 'Center' },
  { value: 'split-align-end', label: 'Bottom' },
  { value: 'split-align-stretch', label: 'Stretch' },
]

const availableBlocks = $derived(blockMeta.filter((b) => b.type !== 'block-split'))

function getColumnBlock(columnIndex: number): ContentType | undefined {
  return Object.values($currentProject?.content || {}).find((c) => c.parent === String(element.id) && (c as ContentType & { columnIndex?: number }).columnIndex === columnIndex) as
    ContentType | undefined
}
</script>

<SelectWithLabel
  label="Columns"
  options={columnOptions}
  selectedValue={String(localElement.settings.columns)}
  onchange={(v) => {
    localElement.settings.columns = Number(v)
    onChange(localElement)
  }} />

{#if localElement.settings.columns > 1}
  <SelectWithLabel
    label="Gap"
    options={gapOptions}
    selectedValue={localElement.settings.gap ?? 'split-gap-md'}
    onchange={(v) => {
      localElement.settings.gap = v
      onChange(localElement)
    }} />
  <SelectWithLabel
    label="Alignment"
    options={alignOptions}
    selectedValue={localElement.settings.align ?? 'split-align-start'}
    onchange={(v) => {
      localElement.settings.align = v
      onChange(localElement)
    }} />
{/if}

{#each Array(localElement.settings.columns) as _, i}
  {@const existing = getColumnBlock(i)}
  <div class="column-section">
    <div class="column-label">Column {i + 1}</div>
    {#if existing}
      <div class="column-filled">
        {existing.label ?? existing.type}
      </div>
    {:else}
      <div class="column-buttons">
        {#each availableBlocks as blockDef}
          <button type="button" onclick={() => addBlockToColumn(blockDef.type, i)}>
            + {blockDef.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/each}

<style>
.column-section {
  margin-top: 12px;
  padding: 8px;
  border: 1px solid #444;
  border-radius: 4px;
}

.column-label {
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 6px;
}

.column-filled {
  font-size: 0.75rem;
  color: #ccc;
  padding: 4px 8px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2a2a2a;
}

.column-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  > button {
    padding: 4px 8px;
    background-color: transparent;
    border: 1px solid #555;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.75rem;

    &:hover {
      border-color: #888;
    }
  }
}
</style>
