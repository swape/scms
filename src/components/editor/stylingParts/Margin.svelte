<script lang="ts">
import { selectedElement } from '../../../store.ts'

const { updatePageContentWithDebounce, update } = $props()

function getStyleNumberValue(key: string): string {
  const value = $selectedElement?.style?.[key]

  if (value === '' || value === undefined || value === null) {
    return ''
  }

  return String(value)
}

function updateMarginValue(key: string, event: Event) {
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
  <label>Margin Block (px):</label>
  <div class="margin-block-grid">
    <input id="margin-top" type="number" placeholder="Top" value={getStyleNumberValue('marginTop')} oninput={(event) => updateMarginValue('marginTop', event)} />
    <input id="margin-bottom" type="number" placeholder="Bottom" value={getStyleNumberValue('marginBottom')} oninput={(event) => updateMarginValue('marginBottom', event)} />
  </div>
</div>

<style>
.margin-block-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-bottom: 8px;
}
</style>
