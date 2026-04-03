<script lang="ts">
const { label, options, selectedValue, onchange } = $props<{
  label: string
  options: { value: string; label: string }[]
  selectedValue: string
  onchange?: (value: string) => void
}>()
</script>

<div class="forms">
  <label
    ><span>{label}</span>
    <select class="select" value={selectedValue} onchange={(e) => onchange?.((e.target as HTMLSelectElement).value)}>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </label>
</div>
