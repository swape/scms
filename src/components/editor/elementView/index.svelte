<script>
import BlockButtonView from './BlockButtonView.svelte'
import BlockDividerView from './BlockDividerView.svelte'
import BlockLinkView from './BlockLinkView.svelte'
import BlockTextView from './BlockTextView.svelte'

const { block } = $props()
</script>

{#if block?.type === 'block-text'}
  <BlockTextView {block} />
{/if}
{#if block?.type === 'block-divider'}
  <BlockDividerView {block} />
{/if}
{#if block?.type === 'block-button'}
  <BlockButtonView {block} />
{/if}
{#if block?.type === 'block-link'}
  <BlockLinkView {block} />
{/if}
