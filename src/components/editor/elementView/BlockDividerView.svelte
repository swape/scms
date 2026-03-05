<script>
import InfoHelper from './InfoHelper.svelte'

const { block } = $props()
let blockStyles = $derived(
  `${block.styles?.spacingTop || ''} ${block.styles?.spacingBottom || ''} ${block.styles?.blockWidth || ''}`.trim()
)
let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim())

let colors = $derived(`${block.colors?.backgroundColorKey}`.trim())
</script>

<div
  class={`${blockStyles} ${wrapperClass === 'max-w-full' ? '' : 'mx-auto container'} relative`}>
  <InfoHelper {block} />
  {#if block}
    <div class={`${colors} h-px`}></div>
  {/if}
</div>
