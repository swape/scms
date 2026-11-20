<script lang="ts">
import Select from '../../components/Select.svelte'
import { getStyleEditor } from '../../utils/editor-style.ts'

const { allowCenter = false }: { allowCenter?: boolean } = $props()
const style = getStyleEditor()
</script>

<Select id="wrapper-options" label="Wrapper:" value={style.read('wrapper') ?? ''} onchange={(event) => style.set('wrapper', event.currentTarget.value)}>
  <option value="container">Container</option>
  {#if allowCenter}
    <option value="center">Center</option>
  {/if}
  <option value="">None</option>
</Select>
