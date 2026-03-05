<script>
import BlockDividerView from './BlockDividerView.svelte'
import BlockTextView from './BlockTextView.svelte'

const { block } = $props()
</script>

{#if block?.type === 'block-text'}
  <BlockTextView {block} />
{/if}
{#if block?.type === 'block-divider'}
  <BlockDividerView {block} />
{/if}
