<script lang="ts" generics="T extends string | number">
import type { SelectProps } from '../types/types.ts'

const generatedId = $props.id()
let { id = generatedId, label, wrapperClass = 'input-and-label-wrapper', hint, value = $bindable(), children, ...attributes }: SelectProps<T> = $props()
</script>

<div class={wrapperClass}>
  <label for={id}>{label}</label>
  <select {id} {...attributes} bind:value>
    {@render children()}
  </select>
  {#if hint}
    <small>{hint}</small>
  {/if}
</div>
