<script lang="ts">
let {
  label,
  value = $bindable<string>(),
  rows = 5,
  onchange,
} = $props<{
  label: string
  value: string
  rows?: number
  onchange?: () => void
}>()
</script>

<div class="forms">
  <label>
    <span>{label}:</span>
    <textarea {rows} bind:value onkeyup={() => onchange?.()}></textarea>
  </label>
</div>
