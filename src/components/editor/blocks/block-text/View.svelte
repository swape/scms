<script>
import InfoHelper from '../../elementView/InfoHelper.svelte'

const { block } = $props()
let blockStyles = $derived(
  `${block.styles?.marginTop || ''} ${block.styles?.marginBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlinePadding || ''} ${block.styles?.blockPadding || ''} ${block.styles?.borderRadius || ''} ${block.styles?.borderWidth || ''} ${block.styles?.cornerShape || ''} ${block.styles?.textAlign || ''} ${block.colors?.backgroundColorKey || ''}`.trim()
)
let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim())
let colors = $derived(`${block.colors?.textColorKey || ''}`.trim())
let borderColorStyle = $derived(
  block.colors?.borderColorKey ? `--block-border-color: light-dark(var(--${block.colors.borderColorKey}), var(--${block.colors.borderColorKey}_dark));` : ''
)
</script>

<div class={`${colors} ${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} relative`} style={borderColorStyle}>
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
