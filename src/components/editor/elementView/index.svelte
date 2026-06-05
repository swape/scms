<script>
import { getBlockByType } from '../blocks/registry'

const { block } = $props()
let def = $derived(getBlockByType(block?.type))
</script>

{#if def}
  <svelte:component this={def.ViewComponent} {block} />
{/if}
