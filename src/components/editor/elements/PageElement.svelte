<script>
let { element, onChange } = $props()
let localElement = $derived(structuredClone(element))
</script>

<div class="forms">
  <label>
    <span>Title:</span>
    <input
      type="text"
      bind:value={localElement.title}
      onkeyup={() => onChange(localElement)} />
  </label>

  <label>
    <span>Order:</span>
    <input
      type="number"
      bind:value={localElement.order}
      onkeyup={() => onChange(localElement)} />
  </label>
</div>
