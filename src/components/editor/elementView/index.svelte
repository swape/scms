<script lang="ts">
import { getContext } from 'svelte'
import type { BlockDefinition } from '../blocks/registry'

const getBlockByType = getContext<(type: string) => BlockDefinition | undefined>('getBlockByType')

const { block } = $props()
let def = $derived(getBlockByType(block?.type))
</script>

{#if def}
  <def.ViewComponent {block} />
{/if}
