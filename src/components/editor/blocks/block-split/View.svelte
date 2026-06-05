<script lang="ts">
import { currentProject } from '../../../../store'
import type { ContentType } from '../../../../types/types'
import ElementView from '../../elementView/index.svelte'
import InfoHelper from '../../elementView/InfoHelper.svelte'

const { block } = $props()

let columns = $derived(Number(block.settings?.columns) || 2)
let gap = $derived(block.settings?.gap ?? 'split-gap-md')
let align = $derived(block.settings?.align ?? 'split-align-start')

let blockStyles = $derived(
  `${block.styles?.marginTop || ''} ${block.styles?.marginBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlinePadding || ''} ${block.styles?.blockPadding || ''} ${block.colors?.backgroundColorKey || ''}`.trim()
)

function getColumnBlocks(columnIndex: number): ContentType[] {
  return Object.values($currentProject?.content || {})
    .filter((c) => c.parent === String(block.id) && (c as ContentType & { columnIndex?: number }).columnIndex === columnIndex)
    .sort((a, b) => a.order - b.order) as ContentType[]
}
</script>

<div class={`relative ${block.styles?.blockWidth !== 'block-width-full' ? 'mx-auto container' : ''} ${blockStyles}`}>
  <InfoHelper {block} />
  <div class={`split-block-grid ${gap} ${align}`} style={`--split-columns: ${columns};`}>
    {#each Array(columns) as _, i}
      <div class="split-block-column">
        {#each getColumnBlocks(i) as childBlock (childBlock.id)}
          <ElementView block={childBlock} />
        {/each}
      </div>
    {/each}
  </div>
</div>
