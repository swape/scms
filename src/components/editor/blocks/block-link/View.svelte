<script>
import InfoHelper from '../../elementView/InfoHelper.svelte'

const { block } = $props()
let blockStyles = $derived(
  `${block.styles?.marginTop || ''} ${block.styles?.marginBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlinePadding || ''} ${block.styles?.textAlign || ''}`.trim()
)
let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim())
let colors = $derived(`${block.colors?.textColorKey || ''} ${block.colors?.backgroundColorKey || ''}`.trim())
</script>

<div class={`${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} relative ${blockStyles}`}>
  <InfoHelper {block} />
  {#if block}
    <a href={block.settings?.href || '#'} target={block.settings?.target || '_self'} class={`${colors} ${block.settings?.underline ?? 'underline'}`}>
      {block.content}
    </a>
  {/if}
</div>
