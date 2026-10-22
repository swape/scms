<script lang="ts">
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

type PaddingMode = 'all' | 'individual'

function getPaddingMode(): PaddingMode {
  const mode = $selectedElement?.style?.paddingMode

  if (mode === 'individual') {
    return 'individual'
  }

  return 'all'
}

function getStyleNumberValue(key: string): string {
  const value = $selectedElement?.style?.[key]

  if (value === '' || value === undefined || value === null) {
    return ''
  }

  return String(value)
}

function updatePaddingMode(event: Event) {
  const select = event.target as HTMLSelectElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, paddingMode: select.value as PaddingMode })
  updatePageContentWithDebounce()
}

function updatePaddingValue(key: string, event: Event) {
  const input = event.target as HTMLInputElement
  const style = $selectedElement?.style || {}
  const nextStyle: Record<string, string | number> = { ...style }

  if (!input.value.trim()) {
    delete nextStyle[key]
  } else {
    nextStyle[key] = Number(input.value)
  }

  update('style', nextStyle)
  updatePageContentWithDebounce()
}
</script>

<Select id="padding-mode" label="Padding Mode:" value={getPaddingMode()} onchange={updatePaddingMode}>
  <option value="all">All Sides</option>
  <option value="individual">Individual</option>
</Select>

{#if getPaddingMode() === 'all'}
  <Input id="padding-all" label="Padding (px):" type="number" min="0" value={getStyleNumberValue('paddingAll')} oninput={(event) => updatePaddingValue('paddingAll', event)} />
{:else}
  <div class="input-and-label-wrapper">
    <label>Padding Individual (px):</label>
    <div class="padding-grid">
      <Input
        id="padding-top"
        label="Top"
        wrapperClass="grid min-w-0 gap-1"
        type="number"
        min="0"
        placeholder="Top"
        value={getStyleNumberValue('paddingTop')}
        oninput={(event) => updatePaddingValue('paddingTop', event)} />
      <Input
        label="Right"
        wrapperClass="grid min-w-0 gap-1"
        id="padding-right"
        type="number"
        min="0"
        placeholder="Right"
        value={getStyleNumberValue('paddingRight')}
        oninput={(event) => updatePaddingValue('paddingRight', event)} />
      <Input
        label="Bottom"
        wrapperClass="grid min-w-0 gap-1"
        id="padding-bottom"
        type="number"
        min="0"
        placeholder="Bottom"
        value={getStyleNumberValue('paddingBottom')}
        oninput={(event) => updatePaddingValue('paddingBottom', event)} />
      <Input
        id="padding-left"
        label="Left"
        wrapperClass="grid min-w-0 gap-1"
        type="number"
        min="0"
        placeholder="Left"
        value={getStyleNumberValue('paddingLeft')}
        oninput={(event) => updatePaddingValue('paddingLeft', event)} />
    </div>
  </div>
{/if}

<style>
.padding-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-bottom: 8px;
}
</style>
