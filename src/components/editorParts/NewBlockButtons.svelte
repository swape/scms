<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store'
import { blockRegistry } from '../editor/blocks/registry'

function addBlock(blockType: string) {
  if (!$currentProject) return
  const def = blockRegistry.find((b) => b.type === blockType)
  if (!def) return
  const oldContent = $currentProject.content || {}
  const newBlockId = Date.now()
  const order = Object.values(oldContent).filter((c) => c.pageId === $selectedPage?.id).length + 1

  const newBlock = def.defaultData({
    id: newBlockId,
    order,
    pageId: $selectedPage?.id,
  })

  currentProject.set({
    ...$currentProject,
    content: { ...oldContent, [newBlockId]: newBlock },
  })

  $selectedElement = newBlock
}
</script>

<div class="element-buttons">
  {#each blockRegistry as blockDef}
    <button type="button" onclick={() => addBlock(blockDef.type)}>{blockDef.label}</button>
  {/each}
</div>

<style>
.element-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;

  > button {
    padding: 5px 10px;
    background-color: transparent;
    border: 1px solid #555;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    flex: 1 1 auto;
  }
}
</style>
