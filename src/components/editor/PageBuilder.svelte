<script lang="ts">
import { currentProject, selectedElement } from '../../store'
import Menu from '../editor/elementView/Menu.svelte'
import { getBlocksAsArray } from '../editor/helper'
import { newBlockElement } from './elementBase'
import ElementView from './elementView/index.svelte'

const { selectedPage } = $props()

function addBlock(blockName = 'blockText') {
  if (!$currentProject) return
  const oldContent = $currentProject.content || {}
  const newBlockId = Date.now()
  let newBlock = null

  const order = Object.values(oldContent).filter((c) => c.pageId === selectedPage.id).length + 1

  if (blockName === 'blockText') {
    newBlock = newBlockElement('blockText', {
      id: newBlockId,
      order,
      pageId: selectedPage.id,
      colors: {
        textColorKey: 'text_1',
        backgroundColorKey: 'bg_1',
      },
    })
  } else if (blockName === 'blockDivider') {
    newBlock = newBlockElement('blockDivider', {
      id: newBlockId,
      order,
      pageId: selectedPage.id,
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

function getColors() {
  if (!$currentProject?.colors) return ''
  const colors = $currentProject.colors
  return `--bg_1: ${colors['bg_1']?.c};
--text_1: ${colors['text_1']?.c};
--bg_2: ${colors['bg_2']?.c};
--text_2: ${colors['text_2']?.c};
--bg_3: ${colors['bg_3']?.c};
--text_3: ${colors['text_3']?.c};
--bg_1_dark: ${colors['bg_1_dark']?.c};
--text_1_dark: ${colors['text_1_dark']?.c};
--bg_2_dark: ${colors['bg_2_dark']?.c};
--text_2_dark: ${colors['text_2_dark']?.c};
--bg_3_dark: ${colors['bg_3_dark']?.c};
--text_3_dark: ${colors['text_3_dark']?.c};
`
}

function getSelectedPageColorClasses() {
  if (!selectedPage) return ''
  const bgClass = selectedPage.colors?.backgroundColorKey || 'bg_1'
  const textClass = selectedPage.colors?.textColorKey || 'text_1'
  return `${bgClass} ${textClass}`
}
</script>

<Menu />
{#if selectedPage?.id}
  <main style={getColors()} class={getSelectedPageColorClasses()}>
    {#each getBlocksAsArray($currentProject?.content, selectedPage.id) as block}
      <ElementView {block} />
    {/each}
  </main>
  <div class="m-4 border-t pt-4 relative">
    Add new elements to the page:

    <div class="element-buttons">
      <button type="button" onclick={() => addBlock('blockText')}>Text block</button>
      <button type="button" onclick={() => addBlock('blockImage')}>Image block</button>
      <button type="button" onclick={() => addBlock('blockVideo')}>Video block</button>
      <button type="button" onclick={() => addBlock('blockDivider')}>Divider</button>
      <button type="button" onclick={() => addBlock('blockButton')}>Button</button>
      <button type="button" onclick={() => addBlock('blockLink')}>Link</button>
      <button type="button" onclick={() => addBlock('blockPageList')}>Page list</button>
    </div>
  </div>
{:else}
  <div class="text-2xl text-center p-5">Please select a page to start editing.</div>
{/if}

<style>
.element-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  padding: 10px;

  > button {
    padding: 5px 10px;
    background-color: transparent;
    border: 1px solid #555;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }
}
</style>
