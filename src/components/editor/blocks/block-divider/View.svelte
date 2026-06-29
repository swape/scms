<script>
import InfoHelper from '../../elementView/InfoHelper.svelte'
import { extractBlockStyles, extractWrapperClass } from '../viewClassHelpers'

const { block } = $props()
let blockStyles = $derived(extractBlockStyles(block, ['marginTop', 'marginBottom', 'blockWidth']))
let wrapperClass = $derived(extractWrapperClass(block))
let colors = $derived(`${block.colors?.backgroundColorKey}`.trim())
</script>

<div class={`${blockStyles} ${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} relative`}>
  <InfoHelper {block} />
  {#if block}
    <div class={`${colors} h-px`}></div>
  {/if}
</div>
