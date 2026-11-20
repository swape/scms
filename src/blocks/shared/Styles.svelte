<script lang="ts">
import PanelSection from '../../components/PanelSection.svelte'
import type { BlockStylesProps } from '../../types/types.ts'
import Margin from './Margin.svelte'
import Padding from './Padding.svelte'
import TextAndBackgroundColors from './TextAndBackgroundColors.svelte'
import Wrapper from './Wrapper.svelte'

const { sections = ['wrapper', 'colors', 'padding', 'margin'], allowCenter = false, children }: BlockStylesProps = $props()
</script>

{#if sections.length > 0}
  <PanelSection title="Styles">
    {#each sections as section}
      {#if section === 'wrapper'}
        <Wrapper {allowCenter} />
      {:else if section === 'colors'}
        <TextAndBackgroundColors />
      {:else if section === 'padding'}
        <Padding />
      {:else if section === 'margin'}
        <Margin />
      {:else if section === 'custom'}
        {@render children?.()}
      {/if}
    {/each}
  </PanelSection>
{/if}
