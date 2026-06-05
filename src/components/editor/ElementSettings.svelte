<script lang="ts">
import {
  blockPaddingOptions,
  borderColorOptions,
  borderRadiusOptions,
  borderWidthOptions,
  colorOptions,
  cornerShapeOptions,
  inlinePaddingOptions,
  spacingBottomOptions,
  spacingOptions,
  textAlignOptions,
  textColorOptions,
  widthOptions,
} from '../../constants'
import { currentProject, selectedElement } from '../../store'
import type { ContentType, PageType } from '../../types/types'
import SelectWithLabel from '../editorParts/SelectWithLabel.svelte'
import { getBlockByType } from './blocks/registry'
import PageElement from './elementSettings/PageElement.svelte'
import { deleteContentItem, deletePageWithContent, isContentElement, saveContent, savePage } from './helper'

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
          <svelte:component this={blockDef.SettingsComponent} element={$selectedElement} onChange={changeAction} />
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

        <!-- Layout: width + alignment -->
        <div class={currentStyleTab === 'layout' ? '' : 'hidden'}>
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
        </div>

        <!-- Space: margins + paddings -->
        <div class={currentStyleTab === 'space' ? '' : 'hidden'}>
          {#if $selectedElement.styles?.marginTop !== undefined}
            <SelectWithLabel
              label="Margin top"
              options={spacingOptions}
              selectedValue={$selectedElement.styles.marginTop ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.marginTop = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.styles?.marginBottom !== undefined}
            <SelectWithLabel
              label="Margin bottom"
              options={spacingBottomOptions}
              selectedValue={$selectedElement.styles.marginBottom ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.marginBottom = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.styles?.inlinePadding !== undefined}
            <SelectWithLabel
              label="Inline padding"
              options={inlinePaddingOptions}
              selectedValue={$selectedElement.styles.inlinePadding ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.inlinePadding = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.styles?.blockPadding !== undefined}
            <SelectWithLabel
              label="Block padding"
              options={blockPaddingOptions}
              selectedValue={$selectedElement.styles.blockPadding ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.blockPadding = v
                changeAction($selectedElement)
              }} />
          {/if}
        </div>

        <!-- Border: radius, width, shape, color -->
        <div class={currentStyleTab === 'border' ? '' : 'hidden'}>
          {#if $selectedElement.styles?.borderRadius !== undefined}
            <SelectWithLabel
              label="Border Radius"
              options={borderRadiusOptions}
              selectedValue={$selectedElement.styles.borderRadius ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.borderRadius = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.styles?.borderWidth !== undefined}
            <SelectWithLabel
              label="Border Width"
              options={borderWidthOptions}
              selectedValue={$selectedElement.styles.borderWidth ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.borderWidth = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.styles?.cornerShape !== undefined}
            <SelectWithLabel
              label="Corner Shape"
              options={cornerShapeOptions}
              selectedValue={$selectedElement.styles.cornerShape ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).styles!.cornerShape = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.colors?.borderColorKey !== undefined}
            <SelectWithLabel
              label="Border Color"
              options={borderColorOptions}
              selectedValue={$selectedElement.colors.borderColorKey ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).colors!.borderColorKey = v
                changeAction($selectedElement)
              }} />
          {/if}
        </div>

        <!-- Colors: background + text -->
        <div class={currentStyleTab === 'colors' ? '' : 'hidden'}>
          {#if $selectedElement.colors?.backgroundColorKey !== undefined}
            <SelectWithLabel
              label="Background Color"
              options={colorOptions}
              selectedValue={$selectedElement.colors.backgroundColorKey ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).colors!.backgroundColorKey = v
                changeAction($selectedElement)
              }} />
          {/if}
          {#if $selectedElement.colors?.textColorKey !== undefined}
            <SelectWithLabel
              label="Text Color"
              options={textColorOptions}
              selectedValue={$selectedElement.colors.textColorKey ?? ''}
              onchange={(v) => {
                ;($selectedElement as ContentType).colors!.textColorKey = v
                changeAction($selectedElement)
              }} />
          {/if}
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
