<script lang="ts">
const { element, update, title, id, styleName } = $props()
</script>

<div class="input-and-label-wrapper">
  <label for={id}>{title}:</label>
  <select {id} value={element?.style?.[styleName] || 'left'} onchange={(event) => update('style', { ...element?.style, [styleName]: (event.target as HTMLSelectElement).value })}>
    <option value="left">Left</option>
    <option value="center">Center</option>
    <option value="right">Right</option>
    <option value="justify">Justify</option>
  </select>
</div>
