<script lang="ts">
import { currentProject } from '../../../store.ts'
import type { ColorType } from '../../../types/types.ts'

const { element, title, id, update, styleName, isBgColors = true } = $props()

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
</script>

<div class="input-and-label-wrapper">
  <label for={id}>{title}:</label>
  <select {id} value={(element?.style?.[styleName] as string) || ''} onchange={update}>
    {#if isBgColors}
      {#each bgColors as color}
        <option value={color.key}>{color.name}</option>
      {/each}
    {:else}
      {#each textColors as color}
        <option value={color.key}>{color.name}</option>
      {/each}
    {/if}
    <option value="">None</option>
  </select>
</div>
