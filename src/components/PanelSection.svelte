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
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--ui-border, #444);
  color: var(--ui-text, #f5f5f5);
  font-family: inherit;
  font-size: 12px;
  line-height: 1.4;
}

header {
  display: flex;
  min-height: 24px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

h3 {
  min-width: 0;
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
}

.section-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
}
</style>
