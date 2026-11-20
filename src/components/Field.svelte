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
  gap: 6px;
  margin: 0 0 12px;
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 12px;
  line-height: 1.4;
}

label {
  display: block;
  margin: 0;
  color: var(--ui-muted, #b3b3b3);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

small {
  color: var(--ui-muted, #b3b3b3);
  font-size: 11px;
  line-height: 16px;
}

:where(.ui-field) :global(.ui-control) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 32px;
  margin: 0;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: var(--ui-field, #383838);
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
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
  outline: 1px solid var(--ui-accent, #0c8ce9);
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
