<script lang="ts">
import type { ButtonProps } from '../types/types.ts'
import Icon from './Icon.svelte'

let {
  type = 'button',
  icon,
  iconPosition = 'start',
  iconOnly = false,
  variant = 'secondary',
  active = false,
  size = 'md',
  fullWidth = false,
  ref = $bindable(),
  class: className,
  children,
  ...attributes
}: ButtonProps = $props()
</script>

<button
  {...attributes}
  {type}
  bind:this={ref}
  class={['ui-button', className]}
  class:variant-ghost={variant === 'ghost'}
  class:variant-secondary={variant === 'secondary'}
  class:variant-primary={variant === 'primary'}
  class:variant-danger={variant === 'danger'}
  class:ui-active={active}
  class:ui-small={size === 'sm'}
  class:ui-icon-only={iconOnly}
  class:ui-full-width={fullWidth}>
  {#if icon && iconPosition === 'start'}
    <Icon name={icon} />
  {/if}
  {@render children?.()}
  {#if icon && iconPosition === 'end'}
    <Icon name={icon} />
  {/if}
</button>

<style>
.ui-button {
  display: inline-flex;
  box-sizing: border-box;
  min-width: 0;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease;
}

.variant-secondary {
  border-color: var(--ui-border, #444);
  background: var(--ui-panel-raised, #383838);
}

.variant-primary {
  border-color: var(--ui-accent, #0c8ce9);
  background: var(--ui-accent, #0c8ce9);
  color: #fff;
}

.variant-danger {
  color: var(--ui-danger, #ff8c85);
}

.variant-ghost:hover:not(:disabled),
.variant-secondary:hover:not(:disabled) {
  background: var(--ui-hover, #444);
}

.variant-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ui-accent, #0c8ce9), #fff 12%);
  border-color: transparent;
}

.variant-danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ui-danger, #ff8c85) 14%, transparent);
}

.ui-active,
.ui-active:hover:not(:disabled) {
  background: var(--ui-selection, #164b70);
  color: var(--ui-text, #f5f5f5);
}

.ui-small {
  min-height: 30px;
  padding: 5px 8px;
}

.ui-icon-only {
  width: 32px;
  min-width: 32px;
  height: 32px;
  padding: 0;
  flex: 0 0 auto;
}

.ui-icon-only.ui-small {
  width: 30px;
  min-width: 30px;
  height: 30px;
}

.ui-full-width {
  width: 100%;
}

.ui-button:focus-visible {
  outline: 2px solid var(--ui-accent, #0c8ce9);
  outline-offset: 2px;
}

.ui-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .ui-button {
    transition: none;
  }
}
</style>
