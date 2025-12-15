<script>
import { currentProject, selectedElement } from '../../store'
import { getBlocksAsArray } from '../editor/helper'
const { selectedPage } = $props()

function addBlock() {
  // TODO: fix this to select blocks from a list

  const oldContent = $currentProject.content || {}

  const newBlockId = Date.now()
  const newBlock = {
    id: newBlockId,
    type: 'block-text',
    content: 'New Block',
    order: Object.values(oldContent).filter((c) => c.pageId === selectedPage.id).length + 1,
    pageId: selectedPage.id,
    settings: {},
    parent: null
  }

  currentProject.set({
    ...$currentProject,
    content: { ...oldContent, [newBlockId]: newBlock }
  })

  $selectedElement = newBlock

  // TODO: select the new block after adding
}

function selectThis(elm) {
  $selectedElement = elm
}
</script>

{#if selectedPage?.id}
  <div class="w-full p-4 bg-slate-900 text-white">
    <div>page-builder for page: {selectedPage?.id} {selectedPage?.title}</div>
    <textarea class="w-full h-96 border p-2 mt-2">{JSON.stringify($currentProject.content)}</textarea>
  </div>
  {#each getBlocksAsArray($currentProject.content, selectedPage.id) as block}
    <div class="w-full p-4 bg-slate-800 text-white mt-2">
      <div>Block ID: {block.id} | Type: {block.type} | Order: {block.order}</div>
      <div>Content: {block.content}</div>
      <button onclick={() => selectThis(block)} type="button" class="btn active p-3">Select</button>
    </div>
  {/each}

  <div class="mt-4"><button class="btn p-3 active" type="button" onclick={addBlock}>Add Element</button></div>
{/if}
