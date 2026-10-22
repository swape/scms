<script lang="ts">
import { projects } from '../../store.ts'
import type { ColorType, ProjectType } from '../../types/types.ts'
import Input from '../Input.svelte'

let { id } = $props()

let project = $state<ProjectType | null>(null)

let colors = $state<ColorType[]>([])

$effect(() => {
  if ($projects) {
    const found = $projects.find((item) => item.id === id)
    if (found) {
      project = found
      colors = found.colors || []
    }
  }
})

function changeColor(key: string, value: string, isDark: boolean = false) {
  const newColors = colors.map((color) => {
    if (color.key === key) {
      if (isDark) {
        return { ...color, cDark: value }
      } else {
        return { ...color, c: value }
      }
    }
    return color
  })
  colors = newColors

  if (project) {
    project.colors = colors
    save()
  }
}

function save() {
  if (!$projects || !project) {
    return
  }
  const updatedProjects = $projects.map((p) => (p.id === project?.id ? project : p))
  projects.set(updatedProjects)
}
</script>

{#if project?.id}
  <h2 class="mb-5 text-2xl">Colors for {project.title}</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#each colors as color}
      <div class="flex flex-col">
        <div class="color-row">
          <Input
            label={color.name}
            wrapperClass="color-picker"
            type="color"
            bind:value={color.c}
            oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement).value)} />
          <Input
            label={`${color.name} value`}
            wrapperClass="color-value"
            bind:value={color.c}
            oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement).value)} />
        </div>
        <div class="color-row">
          <Input
            label={`Dark ${color.name}`}
            wrapperClass="color-picker"
            type="color"
            bind:value={color.cDark}
            oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement).value, true)} />
          <Input
            label={`Dark ${color.name} value`}
            wrapperClass="color-value"
            bind:value={color.cDark}
            oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement).value, true)} />
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
.color-row {
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 0.5rem;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 5px 12px;
  margin-top: 2px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 100, 0.1);
  }
}

.color-row :global(.color-picker) {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
}

.color-row :global(.color-picker label) {
  flex: 1;
  font-weight: 600;
}

.color-row :global(.color-value) {
  min-width: 0;
  flex: 1;
}

.color-row :global(.color-value label) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.color-row :global(input) {
  min-width: 9ch;
  min-height: 4ch;
  max-width: 100%;
}
</style>
