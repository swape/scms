<script lang="ts">
import {
  colorOptions,
  inlineSpacingOptions,
  spacingOptions,
  textAlignOptions,
  textColorOptions,
  widthOptions,
} from '../../constants'
import { currentProject, selectedElement } from '../../store'
import type { ContentType, PageType } from '../../types/types'
import SelectWithLabel from '../editorParts/SelectWithLabel.svelte'
import BlockDivider from './elementSettings/BlockDivider.svelte'
import BlockText from './elementSettings/BlockText.svelte'
import PageElement from './elementSettings/PageElement.svelte'
import {
  deleteContentItem,
  deletePageWithContent,
  isContentElement,
  saveContent,
  savePage,
} from './helper'

let currentTab = $state('settings')

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
      <button
        class={currentTab === 'settings' ? 'active' : ''}
        onclick={() => changeTab('settings')}>Settings</button>
      <button
        class={currentTab === 'style' ? 'active' : ''}
        onclick={() => changeTab('style')}>Style</button>
    </div>

    <div class={currentTab === 'settings' ? '' : 'hidden'}>
      {#if $selectedElement.type === 'page'}
        <PageElement element={$selectedElement} onChange={changeAction} />
      {/if}
      {#if $selectedElement.type === 'block-text'}
        <BlockText element={$selectedElement} onChange={changeAction} />
      {/if}
      {#if $selectedElement.type === 'block-divider'}
        <BlockDivider element={$selectedElement} onChange={changeAction} />
      {/if}
    </div>
    <div class={currentTab === 'style' ? '' : 'hidden'}>
      <!-- element styles-->
      {#if isContentElement($selectedElement)}
        {#if $selectedElement.styles?.spacingTop !== undefined}
          <SelectWithLabel
            label="Spacing-top"
            options={spacingOptions}
            selectedValue={$selectedElement.styles.spacingTop ?? ''}
            onchange={(v) => {
              ;($selectedElement as ContentType).styles!.spacingTop = v
              changeAction($selectedElement)
            }} />
        {/if}

        {#if $selectedElement.styles?.spacingBottom !== undefined}
          <SelectWithLabel
            label="Spacing-bottom"
            options={spacingOptions}
            selectedValue={$selectedElement.styles.spacingBottom ?? ''}
            onchange={(v) => {
              ;($selectedElement as ContentType).styles!.spacingBottom = v
              changeAction($selectedElement)
            }} />
        {/if}

        {#if $selectedElement.styles?.blockWidth !== undefined}
          <SelectWithLabel
            label="Block width"
            options={widthOptions}
            selectedValue={$selectedElement.styles.blockWidth ?? ''}
            onchange={(v) => {
              ;($selectedElement as ContentType).styles!.blockWidth = v
              changeAction($selectedElement)
            }} />
        {/if}

        {#if $selectedElement.styles?.textAlign !== undefined}
          <SelectWithLabel
            label="Text Align"
            options={textAlignOptions}
            selectedValue={$selectedElement.styles.textAlign ?? ''}
            onchange={(v) => {
              ;($selectedElement as ContentType).styles!.textAlign = v
              changeAction($selectedElement)
            }} />
        {/if}

        {#if $selectedElement.styles?.inlineSpacing !== undefined}
          <SelectWithLabel
            label="Inline spacing"
            options={inlineSpacingOptions}
            selectedValue={$selectedElement.styles.inlineSpacing ?? ''}
            onchange={(v) => {
              ;($selectedElement as ContentType).styles!.inlineSpacing = v
              changeAction($selectedElement)
            }} />
        {/if}

        {#if $selectedElement.colors}
          <SelectWithLabel
            label="Background Color"
            options={colorOptions}
            selectedValue={$selectedElement.colors.backgroundColorKey ?? ''}
            onchange={(v) => {
              ;($selectedElement as ContentType).colors!.backgroundColorKey = v
              changeAction($selectedElement)
            }} />
          {#if $selectedElement.colors.textColorKey !== undefined}
            <SelectWithLabel
              label="Text Color"
              options={textColorOptions}
              selectedValue={$selectedElement.colors.textColorKey ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).colors!.textColorKey = v
                changeAction($selectedElement)
              }} />
          {/if}
        {/if}
      {/if}
    </div>
    <div class="mt-4 flex gap-3 items-center flex-wrap">
      <button
        type="button"
        class="btn px-4 py-2 delete"
        onclick={() => deleteElement($selectedElement)}>Delete</button>
    </div>
  {:else}
    <p>No element selected.</p>
  {/if}
</div>
