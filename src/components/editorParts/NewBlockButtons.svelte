<script lang="ts">
import { currentProject, selectedElement, selectedPage } from '../../store'
import { newBlockElement } from '../editor/elementBase'

function addBlock(blockName = 'blockText') {
  if (!$currentProject) return
  const oldContent = $currentProject.content || {}
  const newBlockId = Date.now()
  let newBlock = null

  const order = Object.values(oldContent).filter((c) => c.pageId === $selectedPage?.id).length + 1

  if (blockName === 'blockText') {
    newBlock = newBlockElement('blockText', {
      id: newBlockId,
      order,
      pageId: $selectedPage?.id,
      colors: {
        textColorKey: 'text_1',
        backgroundColorKey: 'bg_1',
      },
    })
  } else if (blockName === 'blockDivider') {
    newBlock = newBlockElement('blockDivider', {
      id: newBlockId,
      order,
      pageId: $selectedPage?.id,
    })
  } else if (blockName === 'blockButton') {
    newBlock = newBlockElement('blockButton', {
      id: newBlockId,
      order,
      pageId: $selectedPage?.id,
    })
  } else if (blockName === 'blockLink') {
    newBlock = newBlockElement('blockLink', {
      id: newBlockId,
      order,
      pageId: $selectedPage?.id,
    })
  }

  if (newBlock) {
    currentProject.set({
      ...$currentProject,
      content: { ...oldContent, [newBlockId]: newBlock },
    })

    $selectedElement = newBlock
  }
}
</script>

<div class="element-buttons">
  <button type="button" onclick={() => addBlock('blockText')}>Text block</button>
  <button type="button" onclick={() => addBlock('blockImage')}>Image block</button>
  <button type="button" onclick={() => addBlock('blockVideo')}>Video block</button>
  <button type="button" onclick={() => addBlock('blockDivider')}>Divider</button>
  <button type="button" onclick={() => addBlock('blockButton')}>Button</button>
  <button type="button" onclick={() => addBlock('blockLink')}>Link</button>
  <button type="button" onclick={() => addBlock('blockPageList')}>Page list</button>
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
