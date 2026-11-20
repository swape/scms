<script lang="ts">
import type { FieldProps } from '../types/types.ts'

const { id, label, wrapperClass = '', hint, children }: FieldProps = $props()
</script>

<div class={['ui-field', wrapperClass]}>
  <label for={id}>{label}</label>
  {@render children()}
  {#if hint}
    <small id={`${id}-hint`}>{hint}</small>
  {/if}
</div>

<style>
.ui-field {
  display: grid;
  min-width: 0;
  gap: 0.375rem;
  margin: 0 0 0.75rem;
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.4;
}

label {
  display: block;
  margin: 0;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
}

small {
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.6875rem;
  line-height: 1rem;
}

:where(.ui-field) :global(.ui-control) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 2rem;
  margin: 0;
  padding: 0.375rem 0.5rem;
  border: 0.0625rem solid transparent;
  border-radius: 0.3125rem;
  background-color: var(--ui-field, #383838);
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color-scheme: dark;
  transition:
    border-color 120ms ease,
    background-color 120ms ease;
}

:where(.ui-field) :global(.ui-control:hover:not(:disabled)) {
  border-color: var(--ui-border, #444);
}

:where(.ui-field) :global(.ui-control:focus-visible) {
  border-color: var(--ui-accent, #0c8ce9);
  outline: 0.0625rem solid var(--ui-accent, #0c8ce9);
  outline-offset: 0;
  box-shadow: none;
}

:where(.ui-field) :global(.ui-control:disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}

:where(.ui-field) :global(.ui-control::placeholder) {
  color: var(--ui-muted, #b3b3b3);
  opacity: 0.75;
}

@media (prefers-reduced-motion: reduce) {
  :where(.ui-field) :global(.ui-control) {
    transition: none;
  }
}
</style>
