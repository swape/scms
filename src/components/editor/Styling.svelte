<script lang="ts">
import { currentProject, selectedElement } from '../../store.ts'
import type { ColorType } from '../../types/types.ts'

const { updatePageContentWithDebounce, update } = $props()
let colors = $state<Record<string, ColorType>>({})
let bgColors = $state([] as ColorType[])
let textColors = $state([] as ColorType[])

currentProject.subscribe((project) => {
  if (project) {
    const projectColors = project.colors ?? {}
    colors = projectColors
    bgColors = []
    textColors = []

    Object.values(projectColors).forEach((value) => {
      if (value.key.startsWith('bg_')) {
        if (!value.key.endsWith('_dark')) {
          bgColors.push(value)
        }
      }

      if (value.key.startsWith('text_')) {
        if (!value.key.endsWith('_dark')) {
          textColors.push(value)
        }
      }
    })
  }
})

function updateWrapper(event: Event) {
  const select = event.target as HTMLSelectElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, wrapper: select.value })
  updatePageContentWithDebounce()
}

function updateBackgroundColor(event: Event) {
  const input = event.target as HTMLInputElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, backgroundColor: input.value })
  updatePageContentWithDebounce()
}

function updateTextColor(event: Event) {
  const input = event.target as HTMLInputElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, textColor: input.value })
  updatePageContentWithDebounce()
}
</script>

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>

{#if $selectedElement?.type !== 'page'}
  <div class="input-and-label-wrapper">
    <label for="wrapper-options">Wrapper:</label>
    <select id="wrapper-options" value={($selectedElement?.style?.wrapper as string) || ''} onchange={updateWrapper}>
      <option value="container">Container</option>
      <option value="">None</option>
    </select>
  </div>
{/if}

<div class="input-and-label-wrapper">
  <label for="background-color">Background Color:</label>
  <select id="background-color" value={($selectedElement?.style?.backgroundColor as string) || ''} onchange={updateBackgroundColor}>
    {#each bgColors as color}
      <option value={color.key}>{color.name}</option>
    {/each}
    <option value="">None</option>
  </select>
</div>

<div class="input-and-label-wrapper">
  <label for="text-color">Text Color:</label>
  <select id="text-color" value={($selectedElement?.style?.textColor as string) || ''} onchange={updateTextColor}>
    {#each textColors as color}
      <option value={color.key}>{color.name}</option>
    {/each}
    <option value="">None</option>
  </select>
</div>
