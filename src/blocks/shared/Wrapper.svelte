<script lang="ts">
import Select from '../../components/Select.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'

const { updatePageContentWithDebounce, update, allowCenter = false }: BlockEditorProps & { allowCenter?: boolean } = $props()

function updateWrapper(event: Event) {
  const select = event.target as HTMLSelectElement
  update('style', { ...$selectedElement?.style, wrapper: select.value })
  updatePageContentWithDebounce()
}
</script>

<Select id="wrapper-options" label="Wrapper:" value={$selectedElement?.style?.wrapper || ''} onchange={updateWrapper}>
  <option value="container">Container</option>
  {#if allowCenter}
    <option value="center">Center</option>
  {/if}
  <option value="">None</option>
</Select>
