<script lang="ts">
import type { InputProps } from '../types/types.ts'

const generatedId = $props.id()
let { id = generatedId, label, type = 'text', value = $bindable(), wrapperClass = 'input-and-label-wrapper', hint, ...attributes }: InputProps = $props()
</script>

<div class={wrapperClass}>
  <label for={id}>{label}</label>
  {#if type === 'number'}
    <input {id} type="number" {...attributes} bind:value />
  {:else}
    <input {id} {type} {...attributes} bind:value />
  {/if}
  {#if hint}
    <small>{hint}</small>
  {/if}
</div>
