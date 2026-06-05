<script>
import { getBlockByType } from '../blocks/registry'

const { block } = $props()
let def = $derived(getBlockByType(block?.type))
</script>

{#if def}
  <def.ViewComponent {block} />
{/if}
