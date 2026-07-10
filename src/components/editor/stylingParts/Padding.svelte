<script lang="ts">
import { selectedElement } from '../../../store.ts'

const { updatePageContentWithDebounce, update } = $props()

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

<div class="input-and-label-wrapper">
  <label for="padding-mode">Padding Mode:</label>
  <select id="padding-mode" value={getPaddingMode()} onchange={updatePaddingMode}>
    <option value="all">All Sides</option>
    <option value="individual">Individual</option>
  </select>
</div>

{#if getPaddingMode() === 'all'}
  <div class="input-and-label-wrapper">
    <label for="padding-all">Padding (px):</label>
    <input id="padding-all" type="number" min="0" value={getStyleNumberValue('paddingAll')} oninput={(event) => updatePaddingValue('paddingAll', event)} />
  </div>
{:else}
  <div class="input-and-label-wrapper">
    <label>Padding Individual (px):</label>
    <div class="padding-grid">
      <input id="padding-top" type="number" min="0" placeholder="Top" value={getStyleNumberValue('paddingTop')} oninput={(event) => updatePaddingValue('paddingTop', event)} />
      <input
        id="padding-right"
        type="number"
        min="0"
        placeholder="Right"
        value={getStyleNumberValue('paddingRight')}
        oninput={(event) => updatePaddingValue('paddingRight', event)} />
      <input
        id="padding-bottom"
        type="number"
        min="0"
        placeholder="Bottom"
        value={getStyleNumberValue('paddingBottom')}
        oninput={(event) => updatePaddingValue('paddingBottom', event)} />
      <input id="padding-left" type="number" min="0" placeholder="Left" value={getStyleNumberValue('paddingLeft')} oninput={(event) => updatePaddingValue('paddingLeft', event)} />
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
