<script lang="ts" generics="T extends string">
import type { TabsProps } from '../types/types.ts'
import Button from './Button.svelte'

const { id, label, options, value, onvaluechange }: TabsProps<T> = $props()

function navigate(event: KeyboardEvent, index: number) {
  let next = index
  switch (event.key) {
    case 'ArrowRight':
      next = (index + 1) % options.length
      break
    case 'ArrowLeft':
      next = (index - 1 + options.length) % options.length
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = options.length - 1
      break
    default:
      return
  }
  event.preventDefault()
  onvaluechange(options[next].value)
  const button = event.currentTarget as HTMLButtonElement
  button.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
}
</script>

<div class="ui-tabs" role="tablist" aria-label={label} aria-orientation="horizontal">
  {#each options as option, index (option.value)}
    <Button
      id={`${id}-tab-${option.value}`}
      variant="ghost"
      role="tab"
      aria-selected={value === option.value}
      aria-controls={`${id}-panel`}
      tabindex={value === option.value ? 0 : -1}
      onclick={() => onvaluechange(option.value)}
      onkeydown={(event) => navigate(event, index)}>
      {option.label}
    </Button>
  {/each}
</div>

<style>
.ui-tabs {
  display: flex;
  gap: 0.25rem;
  min-width: 0;
}
.ui-tabs :global([role='tab']) {
  flex: 1;
  min-width: 0;
  padding-inline: 0.375rem;
  border-radius: 0;
  border-bottom: 0.125rem solid transparent;
  color: var(--ui-muted);
  white-space: nowrap;
}
.ui-tabs :global([role='tab'][aria-selected='true']) {
  border-bottom-color: var(--ui-accent);
  color: var(--ui-text);
  font-weight: 600;
}
.ui-tabs :global([role='tab']:focus-visible) {
  outline-offset: -0.125rem;
}
</style>
