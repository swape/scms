<script lang="ts">
import { currentProject, selectedElement } from '../../../store'
import type { ContentType, PageType } from '../../../types/types'
import { getBlockByType } from '../blocks/registry'
import { deleteContentItem, deletePageWithContent, isContentElement, saveContent, savePage } from '../helper'
import PageElement from './PageElement.svelte'
import BorderControlls from './settingsControlls/BorderControlls.svelte'
import ColorsControlls from './settingsControlls/ColorsControlls.svelte'
import LayoutControlls from './settingsControlls/LayoutControlls.svelte'
import SpaceControlls from './settingsControlls/SpaceControlls.svelte'

let currentTab = $state('settings')
let currentStyleTab = $state('layout')

function changeAction(elm: PageType | ContentType | null) {
  if (!elm || !$currentProject) return
  selectedElement.set(elm)
  if (isContentElement(elm)) {
    $currentProject = saveContent($currentProject, elm)
  } else {
    $currentProject = savePage($currentProject, elm as PageType)
  }
}

function deleteElement(elm: PageType | ContentType | null) {
  if (!elm || !$currentProject) return
  if (isContentElement(elm)) {
    $currentProject = deleteContentItem($currentProject, elm)
  } else {
    $currentProject = deletePageWithContent($currentProject, elm as PageType)
  }
  $selectedElement = null
}

function changeTab(tab: string) {
  currentTab = tab
}
</script>

<div>
  {#if $selectedElement}
    <div><small>ID: {$selectedElement.id}</small></div>
    <div><small>Type: {$selectedElement.type}</small></div>

    <div class="tab">
      <button class={currentTab === 'settings' ? 'active' : ''} onclick={() => changeTab('settings')}>Settings</button>
      <button class={currentTab === 'style' ? 'active' : ''} onclick={() => changeTab('style')}>Style</button>
    </div>

    <div class={currentTab === 'settings' ? '' : 'hidden'}>
      {#if $selectedElement.type === 'page'}
        <PageElement element={$selectedElement as PageType} onChange={changeAction} />
      {:else}
        {@const blockDef = getBlockByType($selectedElement.type)}
        {#if blockDef}
          <blockDef.SettingsComponent element={$selectedElement} onChange={changeAction} />
        {/if}
      {/if}
    </div>
    <div class={currentTab === 'style' ? '' : 'hidden'}>
      <!-- element styles-->
      {#if isContentElement($selectedElement)}
        <div class="tab tab--sub">
          <button class={currentStyleTab === 'layout' ? 'active' : ''} onclick={() => (currentStyleTab = 'layout')}>Layout</button>
          <button class={currentStyleTab === 'space' ? 'active' : ''} onclick={() => (currentStyleTab = 'space')}>Space</button>
          <button class={currentStyleTab === 'border' ? 'active' : ''} onclick={() => (currentStyleTab = 'border')}>Border</button>
          <button class={currentStyleTab === 'colors' ? 'active' : ''} onclick={() => (currentStyleTab = 'colors')}>Colors</button>
        </div>

        <div class={currentStyleTab === 'layout' ? '' : 'hidden'}>
          <LayoutControlls element={$selectedElement as ContentType} onChange={changeAction} />
        </div>

        <div class={currentStyleTab === 'space' ? '' : 'hidden'}>
          <SpaceControlls element={$selectedElement as ContentType} onChange={changeAction} />
        </div>

        <div class={currentStyleTab === 'border' ? '' : 'hidden'}>
          <BorderControlls element={$selectedElement as ContentType} onChange={changeAction} />
        </div>

        <div class={currentStyleTab === 'colors' ? '' : 'hidden'}>
          <ColorsControlls element={$selectedElement as ContentType} onChange={changeAction} />
        </div>
      {/if}
    </div>
    <div class="mt-4 flex gap-3 items-center flex-wrap">
      <button type="button" class="btn px-4 py-2 delete" onclick={() => deleteElement($selectedElement)}>Delete</button>
    </div>
  {:else}
    <p>No element selected.</p>
  {/if}
</div>
