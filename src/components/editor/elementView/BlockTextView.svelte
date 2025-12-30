<script>
import InfoHelper from './InfoHelper.svelte'

const { block } = $props()
let blockStyles = $derived(
  `${block.styles?.spacingTop || ''} ${block.styles?.spacingBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlineSpacing || ''} ${block.styles?.textAlign || ''}`.trim()
)
let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim())

let colors = $derived(
  `${block.colors?.textColorKey} ${block.colors?.backgroundColorKey}`.trim()
)
</script>

<div
  class={`${colors} ${wrapperClass === 'max-w-full' ? '' : 'mx-auto container'} relative`}>
  <InfoHelper {block} />
  {#if block}
    {#if block.settings.type === 'Paragraph'}
      <p class={blockStyles}>
        {block.content}
      </p>
    {:else if block.settings.type === 'Heading 1'}
      <h1 class={`text-4xl ${blockStyles}`}>
        {block.content}
      </h1>
    {:else if block.settings.type === 'Heading 2'}
      <h2 class={`text-3xl ${blockStyles}`}>
        {block.content}
      </h2>
    {:else if block.settings.type === 'Heading 3'}
      <h3 class={`text-2xl ${blockStyles}`}>
        {block.content}
      </h3>
    {/if}
  {/if}
</div>
