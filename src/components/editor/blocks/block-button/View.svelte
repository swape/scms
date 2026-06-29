<script>
import InfoHelper from '../../elementView/InfoHelper.svelte'
import { extractBlockStyles, extractWrapperClass } from '../viewClassHelpers'

const { block } = $props()
let blockStyles = $derived(extractBlockStyles(block, ['marginTop', 'marginBottom', 'blockWidth', 'inlinePadding', 'textAlign']))
let wrapperClass = $derived(extractWrapperClass(block))
let colors = $derived(`${block.colors?.textColorKey || ''} ${block.colors?.backgroundColorKey || ''}`.trim())
let borderClasses = $derived(`${block.styles?.borderRadius || ''} ${block.styles?.borderWidth || ''} ${block.colors?.borderColorKey || ''}`.trim())
</script>

<div class={`${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} relative ${blockStyles}`}>
  <InfoHelper {block} />
  {#if block}
    <a href={block.settings?.href || '#'} target={block.settings?.target || '_self'} class={`btn ${block.styles?.padding || 'btn-padding-default'} ${borderClasses} ${colors}`}>
      {block.content}
    </a>
  {/if}
</div>

<style>
.btn {
  display: inline-block;
  text-decoration: none;
}
</style>
