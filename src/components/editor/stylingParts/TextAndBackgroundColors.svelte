<script lang="ts">
import { currentProject, selectedElement } from '../../../store.ts'
import type { ColorType } from '../../../types/types.ts'

const { updatePageContentWithDebounce, update } = $props()

let bgColors = $state([] as ColorType[])
let textColors = $state([] as ColorType[])

currentProject.subscribe((project) => {
  if (project) {
    const projectColors = project.colors ?? []
    bgColors = []
    textColors = []

    projectColors.forEach((value) => {
      if (value.key.startsWith('bg_')) {
        bgColors.push(value)
      }

      if (value.key.startsWith('text_')) {
        textColors.push(value)
      }
    })
  }
})

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
