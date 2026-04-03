<script lang="ts">
import { currentProject, isDarkMode } from '../../store'
import Menu from '../editor/elementView/Menu.svelte'
import { getBlocksAsArray } from '../editor/helper'
import ElementView from './elementView/index.svelte'

const { selectedPage } = $props()

function getColors() {
  if (!$currentProject?.colors) return ''
  const colors = $currentProject.colors
  return `--bg_1: ${colors['bg_1']?.c};
--text_1: ${colors['text_1']?.c};
--bg_2: ${colors['bg_2']?.c};
--text_2: ${colors['text_2']?.c};
--bg_3: ${colors['bg_3']?.c};
--text_3: ${colors['text_3']?.c};
--bg_4: ${colors['bg_4']?.c};
--text_4: ${colors['text_4']?.c};
--bg_5: ${colors['bg_5']?.c};
--text_5: ${colors['text_5']?.c};
--bg_1_dark: ${colors['bg_1_dark']?.c};
--text_1_dark: ${colors['text_1_dark']?.c};
--bg_2_dark: ${colors['bg_2_dark']?.c};
--text_2_dark: ${colors['text_2_dark']?.c};
--bg_3_dark: ${colors['bg_3_dark']?.c};
--text_3_dark: ${colors['text_3_dark']?.c};
--bg_4_dark: ${colors['bg_4_dark']?.c};
--text_4_dark: ${colors['text_4_dark']?.c};
--bg_5_dark: ${colors['bg_5_dark']?.c};
--text_5_dark: ${colors['text_5_dark']?.c};
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
  <main style="{getColors()} color-scheme: {$isDarkMode ? 'dark' : 'light'};" class={getSelectedPageColorClasses()}>
    {#each getBlocksAsArray($currentProject?.content, selectedPage.id) as block}
      <ElementView {block} />
    {/each}
  </main>
  <!-- <textarea id="clipboard" readonly class="w-full h-[800px] bg-slate-300 mt-30">
    {JSON.stringify($currentProject, null, 2)}
  </textarea> -->
{:else}
  <div class="text-2xl text-center p-5">Please select a page to start editing.</div>
{/if}
