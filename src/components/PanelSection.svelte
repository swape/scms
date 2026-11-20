<script lang="ts">
import type { PanelSectionProps } from '../types/types.ts'

const generatedId = $props.id()
const { title, actions, children, class: className = '', id = generatedId }: PanelSectionProps = $props()
</script>

<section {id} class={['ui-panel-section', className]} aria-labelledby={`${id}-heading`}>
  <header>
    <h3 id={`${id}-heading`}>{title}</h3>
    {#if actions}
      <div class="section-actions">{@render actions()}</div>
    {/if}
  </header>
  {@render children?.()}
</section>

<style>
.ui-panel-section {
  min-width: 0;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 0.0625rem solid var(--ui-border, #444);
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.4;
}

header {
  display: flex;
  min-height: 1.5rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

h3 {
  min-width: 0;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.125rem;
}

.section-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.25rem;
}
</style>
