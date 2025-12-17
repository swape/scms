<script>
import BlockTextView from './BlockTextView.svelte'

const { block } = $props()
</script>

{#if block?.type === 'block-text'}
  <BlockTextView {block} />
{/if}
