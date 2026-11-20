<script lang="ts">
import Input from '../../components/Input.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

function getSelectedStyle(): Record<string, string | number> | undefined {
  const element = $selectedElement

  return element && 'style' in element ? element.style : undefined
}

function getStyleNumberValue(key: string): string {
  const value = getSelectedStyle()?.[key]

  if (value === '' || value === undefined || value === null) {
    return ''
  }

  return String(value)
}

function updateMarginValue(key: string, event: Event) {
  const input = event.target as HTMLInputElement
  const style = getSelectedStyle() || {}
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

<fieldset class="margin-fields">
  <legend>Margin Block (px):</legend>
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
</fieldset>

<style>
.margin-fields {
  min-width: 0;
  margin: 0 0 12px;
  padding: 0;
  border: 0;
}

.margin-fields legend {
  margin-bottom: 8px;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
}

.margin-block-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.margin-block-grid :global(.ui-field) {
  margin: 0;
}
</style>
