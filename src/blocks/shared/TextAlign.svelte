<script lang="ts">
import Select from '../../components/Select.svelte'

const { element, update, title, id, styleName } = $props()
</script>

<Select
  {id}
  label={`${title}:`}
  value={element?.style?.[styleName] || 'left'}
  onchange={(event) => update('style', { ...element?.style, [styleName]: (event.target as HTMLSelectElement).value })}>
  <option value="left">Left</option>
  <option value="center">Center</option>
  <option value="right">Right</option>
  <option value="justify">Justify</option>
</Select>
