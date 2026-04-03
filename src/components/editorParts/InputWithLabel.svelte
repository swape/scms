<script lang="ts">
let {
  label,
  inputType,
  value = $bindable<string | number>(),
  onchange,
} = $props<{
  label: string
  inputType: string
  value: string | number
  onchange?: () => void
}>()
</script>

<div class="forms">
  <label>
    <span>{label}:</span>

    {#if inputType === 'number'}
      <input type={inputType} bind:value onchange={() => onchange?.()} />
    {:else}
      <input type={inputType} bind:value onkeyup={() => onchange?.()} />
    {/if}
  </label>
</div>
