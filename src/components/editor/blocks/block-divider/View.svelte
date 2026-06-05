<script>
import InfoHelper from '../../elementView/InfoHelper.svelte'

const { block } = $props()
let blockStyles = $derived(`${block.styles?.marginTop || ''} ${block.styles?.marginBottom || ''} ${block.styles?.blockWidth || ''}`.trim())
let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim())
let colors = $derived(`${block.colors?.backgroundColorKey}`.trim())
</script>

<div class={`${blockStyles} ${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} relative`}>
  <InfoHelper {block} />
  {#if block}
    <div class={`${colors} h-px`}></div>
  {/if}
</div>
