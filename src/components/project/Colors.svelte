<script lang="ts">
import { projects } from '../../store.ts'
import type { ProjectType } from '../../types/types.ts'

let { id } = $props()

let project = $state<ProjectType | null>(null)

let colors = $state<{ [key: string]: { c: string; key: string } }>({})

const colorList = [
  { name: 'Primary Background', key: 'bg_1' },
  { name: 'Primary Text', key: 'text_1' },
  { name: 'Secondary Background', key: 'bg_2' },
  { name: 'Secondary Text', key: 'text_2' },
  { name: 'Accent Color', key: 'bg_3' },
  { name: 'Accent Text', key: 'text_3' },
  { name: 'Tertiary Background', key: 'bg_4' },
  { name: 'Tertiary Text', key: 'text_4' },
  { name: 'Quaternary Background', key: 'bg_5' },
  { name: 'Quaternary Text', key: 'text_5' },
  { name: 'Primary Background Dark', key: 'bg_1_dark' },
  { name: 'Primary Text Dark', key: 'text_1_dark' },
  { name: 'Secondary Background Dark', key: 'bg_2_dark' },
  { name: 'Secondary Text Dark', key: 'text_2_dark' },
  { name: 'Accent Color Dark', key: 'bg_3_dark' },
  { name: 'Accent Text Dark', key: 'text_3_dark' },
  { name: 'Tertiary Background Dark', key: 'bg_4_dark' },
  { name: 'Tertiary Text Dark', key: 'text_4_dark' },
  { name: 'Quaternary Background Dark', key: 'bg_5_dark' },
  { name: 'Quaternary Text Dark', key: 'text_5_dark' },
]

$effect(() => {
  if ($projects) {
    const found = $projects.find((item) => item.id === id)
    if (found) {
      project = found
      colors = found.colors || {}
    }
  }
})

function changeColor(key: string, value: string) {
  colors[key].c = value
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

function getColorName(key: string) {
  const color = colorList.find((c) => c.key === key)
  return color ? color.name : key
}
</script>

{#if project?.id}
  <h2 class="mb-5 text-2xl">Colors for {project.title}</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each Object.entries(colors) as [key, color]}
      <div class="flex flex-col gap-2">
        <label class="font-semibold"
          ><span>{getColorName(key)}</span>
          <input type="color" bind:value={color.c} oninput={({ target }) => changeColor(key, (target as HTMLInputElement)?.value)} />
          <input type="text" bind:value={color.c} oninput={({ target }) => changeColor(key, (target as HTMLInputElement)?.value)} />
        </label>
      </div>
    {/each}
  </div>
{/if}
