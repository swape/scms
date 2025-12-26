<script>
const { block } = $props()
let blockStyles = $derived(
  `${block.styles?.spacingTop || ''} ${block.styles?.spacingBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlineSpacing || ''} ${block.styles?.textAlign || ''}`.trim()
)
</script>

{#if block}
  {#if block.settings.type === 'Paragraph'}
    <p class={blockStyles}>
      {block.content}
    </p>
  {:else if block.settings.type === 'Heading 1'}
    <h1 class={`text-4xl ${blockStyles}`}>
      {block.content}
    </h1>
  {:else if block.settings.type === 'Heading 2'}
    <h2 class={`text-3xl ${blockStyles}`}>
      {block.content}
    </h2>
  {:else if block.settings.type === 'Heading 3'}
    <h3 class={`text-2xl ${blockStyles}`}>
      {block.content}
    </h3>
  {/if}
{/if}
