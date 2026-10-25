<script lang="ts">
import Select from '../../components/Select.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'

const { updatePageContentWithDebounce, update, allowCenter = false }: BlockEditorProps & { allowCenter?: boolean } = $props()

function getSelectedStyle(): Record<string, string | number> | undefined {
  const element = $selectedElement

  return element && 'style' in element ? element.style : undefined
}

function updateWrapper(event: Event) {
  const select = event.target as HTMLSelectElement
  update('style', { ...getSelectedStyle(), wrapper: select.value })
  updatePageContentWithDebounce()
}
</script>

<Select id="wrapper-options" label="Wrapper:" value={getSelectedStyle()?.wrapper || ''} onchange={updateWrapper}>
  <option value="container">Container</option>
  {#if allowCenter}
    <option value="center">Center</option>
  {/if}
  <option value="">None</option>
</Select>
