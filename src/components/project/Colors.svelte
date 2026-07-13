<script lang="ts">
import { projects } from '../../store.ts'
import type { ColorType, ProjectType } from '../../types/types.ts'

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
        <label class="color-label">
          <span>{color.name}</span>

          <input type="color" bind:value={color.c} oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement)?.value)} />
          <input type="text" bind:value={color.c} oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement)?.value)} />
        </label>

        <label class="color-label">
          <span>Dark {color.name}</span>

          <input type="color" bind:value={color.cDark} oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement)?.value, true)} />
          <input type="text" bind:value={color.cDark} oninput={({ target }) => changeColor(color.key, (target as HTMLInputElement)?.value, true)} />
        </label>
      </div>
    {/each}
  </div>
{/if}

<style>
.color-label {
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

  input {
    min-width: 9ch;
    min-height: 4ch;
  }
  span {
    font-weight: 600;
    min-width: 40%;
  }
}
</style>
