<script>
import { projects } from '../../store.js'

let { id } = $props()

let project = $state({
  title: '',
  colors: {},
})

let colors = $state({})

const colorList = [
  { name: 'Primary Background', key: 'bg_1' },
  { name: 'Primary Text', key: 'text_1' },
  { name: 'Secondary Background', key: 'bg_2' },
  { name: 'Secondary Text', key: 'text_2' },
  { name: 'Accent Color', key: 'bg_3' },
  { name: 'Accent Text', key: 'bg_3_text' },
  { name: 'Primary Background Dark', key: 'bg_1_dark' },
  { name: 'Primary Text Dark', key: 'text_1_dark' },
  { name: 'Secondary Background Dark', key: 'bg_2_dark' },
  { name: 'Secondary Text Dark', key: 'text_2_dark' },
  { name: 'Accent Color Dark', key: 'bg_3_dark' },
  { name: 'Accent Text Dark', key: 'bg_3_text_dark' },
]

projects.subscribe((value) => {
  if (value) {
    const found = value.find((item) => item.id === id)
    if (found) {
      project = found
      colors = found.colors || {}
    }
  }
})

function changeColor(key, value) {
  colors[key].c = value
  project.colors = colors
  save()
}

function save() {
  const updatedProjects = $projects.map((p) =>
    p.id === project.id ? project : p
  )
  projects.set(updatedProjects)
}
</script>

{#if project?.id}
  <h2 class="mb-5 text-2xl">Colors for {project.title}</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each Object.entries(colors) as [key, color]}
      <div class="flex flex-col gap-2">
        <label class="font-semibold"
          ><span>{colorList.find((c) => c.key === key).name}</span>
          <input
            type="color"
            bind:value={color.c}
            oninput={(e) => changeColor(key, e.target.value)} />
          <input
            type="text"
            bind:value={color.c}
            oninput={(e) => changeColor(key, e.target.value)} />
        </label>
      </div>
    {/each}
  </div>
{/if}
