<script lang="ts">
import type { TextareaProps } from '../types/types.ts'
import Field from './Field.svelte'

const generatedId = $props.id()
let { id: providedId, label, value = $bindable(), wrapperClass, hint, class: className, 'aria-describedby': describedBy, ...attributes }: TextareaProps = $props()

const id = $derived(providedId ?? generatedId)
const description = $derived(hint ? `${describedBy ? `${describedBy} ` : ''}${id}-hint` : describedBy)
</script>

<Field {id} {label} {wrapperClass} {hint}>
  <textarea {id} {...attributes} class={['ui-control', className]} aria-describedby={description} bind:value></textarea>
</Field>

<style>
textarea {
  display: block;
  min-height: 96px;
  padding: 8px;
  border-color: var(--ui-border, #444);
  resize: vertical;
}
</style>
