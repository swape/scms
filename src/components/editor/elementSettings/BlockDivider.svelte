<script>
let { element, onChange } = $props()
let localElement = $derived(structuredClone(element))
</script>

<div class="forms">
  <label>
    <span>Order:</span>
    <input
      type="number"
      bind:value={localElement.order}
      onkeyup={() => onChange(localElement)} />
  </label>
</div>
