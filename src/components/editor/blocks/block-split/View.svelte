<script lang="ts">
import { currentProject } from '../../../../store'
import type { ContentType } from '../../../../types/types'
import ElementView from '../../elementView/index.svelte'
import InfoHelper from '../../elementView/InfoHelper.svelte'
import { extractBlockStyles, extractWrapperClass } from '../viewClassHelpers'

const { block } = $props()

let columns = $derived(Number(block.settings?.columns) || 2)
let gap = $derived(block.settings?.gap ?? 'split-gap-md')
let align = $derived(block.settings?.align ?? 'split-align-start')

let blockStyles = $derived(extractBlockStyles(block, ['marginTop', 'marginBottom', 'blockWidth', 'inlinePadding', 'blockPadding'], [block.colors?.backgroundColorKey]))
let wrapperClass = $derived(extractWrapperClass(block))

function getColumnBlocks(columnIndex: number): ContentType[] {
  return Object.values($currentProject?.content || {})
    .filter((c) => c.parent === String(block.id) && (c as ContentType & { columnIndex?: number }).columnIndex === columnIndex)
    .sort((a, b) => a.order - b.order) as ContentType[]
}
</script>

<div class={`relative ${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} ${blockStyles}`}>
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
