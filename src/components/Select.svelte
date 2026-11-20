<script lang="ts" generics="T extends string | number">
import type { SelectProps } from '../types/types.ts'
import Field from './Field.svelte'

const generatedId = $props.id()
let { id: providedId, label, wrapperClass, hint, value = $bindable(), children, class: className, 'aria-describedby': describedBy, ...attributes }: SelectProps<T> = $props()

const id = $derived(providedId ?? generatedId)
const description = $derived(hint ? `${describedBy ? `${describedBy} ` : ''}${id}-hint` : describedBy)
</script>

<Field {id} {label} {wrapperClass} {hint}>
  <select {id} {...attributes} class={['ui-control', className]} aria-describedby={description} bind:value>
    {@render children()}
  </select>
</Field>

<style>
select {
  appearance: none;
  padding-right: 1.75rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m5 6.5 3 3 3-3' stroke='%23b3b3b3' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.375rem center;
  background-size: 1rem;
  cursor: pointer;
}

select :global(option) {
  background: var(--ui-panel-raised, #383838);
  color: var(--ui-text, #f5f5f5);
}
</style>
