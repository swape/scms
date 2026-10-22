<script lang="ts">
import Input from '../../components/Input.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

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
    <Input
      id="margin-top"
      label="Top"
      wrapperClass="grid min-w-0 gap-1"
      type="number"
      placeholder="Top"
      value={getStyleNumberValue('marginTop')}
      oninput={(event) => updateMarginValue('marginTop', event)} />
    <Input
      id="margin-bottom"
      label="Bottom"
      wrapperClass="grid min-w-0 gap-1"
      type="number"
      placeholder="Bottom"
      value={getStyleNumberValue('marginBottom')}
      oninput={(event) => updateMarginValue('marginBottom', event)} />
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
