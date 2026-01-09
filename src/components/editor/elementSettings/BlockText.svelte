<script>
let { element, onChange } = $props()
let localElement = $derived(structuredClone(element))
</script>

<div class="forms">
  <label>
    <span>Content:</span>
    {#if localElement.settings.type !== 'Paragraph'}
      <input
        type="text"
        bind:value={localElement.content}
        onkeyup={() => onChange(localElement)} />
    {/if}
    {#if localElement.settings.type === 'Paragraph'}
      <textarea
        rows="5"
        bind:value={localElement.content}
        onkeyup={() => onChange(localElement)}></textarea>
    {/if}
  </label>

  <label>
    <span>Order:</span>
    <input
      type="number"
      bind:value={localElement.order}
      onkeyup={() => onChange(localElement)} />
  </label>

  <label>
    <span>Type:</span>
    <select
      bind:value={localElement.settings.type}
      class="select"
      onchange={() => onChange(localElement)}>
      {#each localElement.options.elementTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  </label>
</div>
