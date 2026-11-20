<script lang="ts">
import type { CheckboxProps } from '../types/types.ts'

const { id, label, checked = false, disabled = false, oninput }: CheckboxProps = $props()
</script>

<label for={id} class="ui-switch" class:is-disabled={disabled}>
  <span class="switch-label">{label}</span>
  <span class="switch-control">
    <input {id} type="checkbox" role="switch" {checked} {disabled} {oninput} />
    <span class="switch-track" aria-hidden="true"></span>
  </span>
</label>

<style>
.ui-switch {
  display: flex;
  min-height: 2rem;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.75rem;
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.125rem;
  cursor: pointer;
}

.switch-label {
  min-width: 0;
  flex: 1;
}

.switch-control {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  width: 1.75rem;
  height: 1rem;
}

input {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}

.switch-track {
  width: 1.75rem;
  height: 1rem;
  border-radius: 0.5rem;
  background: var(--ui-hover, #444);
  transition: background-color 120ms ease;
}

.switch-track::after {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--ui-text, #f5f5f5);
  content: '';
  transition: transform 120ms ease;
}

input:checked + .switch-track {
  background: var(--ui-accent, #0c8ce9);
}

input:checked + .switch-track::after {
  transform: translateX(0.75rem);
}

input:focus-visible + .switch-track {
  outline: 0.125rem solid var(--ui-accent, #0c8ce9);
  outline-offset: 0.1875rem;
}

.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .switch-track,
  .switch-track::after {
    transition: none;
  }
}
</style>
