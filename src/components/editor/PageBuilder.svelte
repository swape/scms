<script>
import { currentProject, selectedElement } from '../../store'
import { getBlocksAsArray } from '../editor/helper'
import { newBlockElement } from './elementBase'
import ElementView from './elementView/index.svelte'

const { selectedPage } = $props()

function addBlock() {
  // TODO: fix this to select blocks from a list

  const oldContent = $currentProject.content || {}

  const newBlockId = Date.now()
  const order =
    Object.values(oldContent).filter((c) => c.pageId === selectedPage.id)
      .length + 1

  const newBlock = newBlockElement('blockText', {
    id: newBlockId,
    order,
    pageId: selectedPage.id,
  })

  currentProject.set({
    ...$currentProject,
    content: { ...oldContent, [newBlockId]: newBlock },
  })

  $selectedElement = newBlock
}

function selectThis(elm) {
  $selectedElement = elm
}
</script>

{#if selectedPage?.id}
  {#each getBlocksAsArray($currentProject.content, selectedPage.id) as block}
    <ElementView {block} />
  {/each}

  <div class="m-4 border-t pt-4">
    <button
      class="p-3 bg-slate-800 text-white cursor-pointer"
      type="button"
      onclick={addBlock}>Add Element</button>
  </div>
{:else}
  <div class="text-2xl text-center p-5">
    Please select a page to start editing.
  </div>
{/if}
