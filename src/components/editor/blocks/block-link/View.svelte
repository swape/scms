<script>
import InfoHelper from '../../elementView/InfoHelper.svelte'
import { extractBlockStyles, extractWrapperClass } from '../viewClassHelpers'

const { block } = $props()
let blockStyles = $derived(extractBlockStyles(block, ['marginTop', 'marginBottom', 'blockWidth', 'inlinePadding', 'textAlign']))
let wrapperClass = $derived(extractWrapperClass(block))
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
