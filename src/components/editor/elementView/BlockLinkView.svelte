<script>
import InfoHelper from './InfoHelper.svelte'

const { block } = $props()
let blockStyles = $derived(
  `${block.styles?.spacingTop || ''} ${block.styles?.spacingBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlineSpacing || ''} ${block.styles?.textAlign || ''}`.trim()
)
let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim())
let colors = $derived(`${block.colors?.textColorKey || ''} ${block.colors?.backgroundColorKey || ''}`.trim())
</script>

<div class={`${wrapperClass === 'max-w-full' ? '' : 'mx-auto container'} relative ${blockStyles}`}>
  <InfoHelper {block} />
  {#if block}
    <a href={block.settings?.href || '#'} target={block.settings?.target || '_self'} class={`${colors} ${block.settings?.underline ?? 'underline'}`}>
      {block.content}
    </a>
  {/if}
</div>
