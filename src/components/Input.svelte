<script lang="ts">
import type { InputProps } from '../types/types.ts'
import Field from './Field.svelte'

const generatedId = $props.id()
let { id: providedId, label, type = 'text', value = $bindable(), wrapperClass, hint, class: className, 'aria-describedby': describedBy, ...attributes }: InputProps = $props()

const id = $derived(providedId ?? generatedId)
const description = $derived(hint ? `${describedBy ? `${describedBy} ` : ''}${id}-hint` : describedBy)
</script>

<Field {id} {label} {wrapperClass} {hint}>
  {#if type === 'number'}
    <input {id} type="number" {...attributes} class={['ui-control', className]} aria-describedby={description} bind:value />
  {:else}
    <input {id} {type} {...attributes} class={['ui-control', className]} aria-describedby={description} bind:value />
  {/if}
</Field>

<style>
input[type='color'] {
  height: 32px;
  padding: 3px;
  cursor: pointer;
}

input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type='color']::-webkit-color-swatch {
  border: 0;
  border-radius: 3px;
}

input[type='color']::-moz-color-swatch {
  border: 0;
  border-radius: 3px;
}
</style>
