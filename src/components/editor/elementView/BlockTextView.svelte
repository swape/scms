<script>
const { block } = $props()
</script>

{#if block}
  {#if block.settings.type === 'Paragraph'}
    <p>{block.content}</p>
  {:else if block.settings.type === 'Heading 1'}
    <h1 class="text-4xl">{block.content}</h1>
  {:else if block.settings.type === 'Heading 2'}
    <h2 class="text-3xl">{block.content}</h2>
  {:else if block.settings.type === 'Heading 3'}
    <h3 class="text-2xl">{block.content}</h3>
  {/if}
{/if}
