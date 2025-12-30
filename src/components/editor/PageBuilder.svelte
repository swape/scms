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
    colors: {
      textColorKey: 'text_1',
      backgroundColorKey: 'bg_1',
    },
  })

  currentProject.set({
    ...$currentProject,
    content: { ...oldContent, [newBlockId]: newBlock },
  })

  $selectedElement = newBlock
}

function getColors() {
  return `--bg_1: ${$currentProject.colors['bg_1'].c};
--text_1: ${$currentProject.colors['text_1'].c};
--bg_2: ${$currentProject.colors['bg_2'].c};
--text_2: ${$currentProject.colors['text_2'].c};
--bg_3: ${$currentProject.colors['bg_3'].c};
--text_3: ${$currentProject.colors['text_3'].c};
--bg_1_dark: ${$currentProject.colors['bg_1_dark'].c};
--text_1_dark: ${$currentProject.colors['text_1_dark'].c};
--bg_2_dark: ${$currentProject.colors['bg_2_dark'].c};
--text_2_dark: ${$currentProject.colors['text_2_dark'].c};
--bg_3_dark: ${$currentProject.colors['bg_3_dark'].c};
--text_3_dark: ${$currentProject.colors['text_3_dark'].c};
`
}

function getSelectedPageColorClasses() {
  if (!selectedPage) return ''
  const bgClass = selectedPage.colors?.backgroundColorKey || 'bg_1'
  const textClass = selectedPage.colors?.textColorKey || 'text_1'
  return `${bgClass} ${textClass}`
}
</script>

{#if selectedPage?.id}
  <main style={getColors()} class={getSelectedPageColorClasses()}>
    {#each getBlocksAsArray($currentProject.content, selectedPage.id) as block}
      <ElementView {block} />
    {/each}
  </main>
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
