<script lang="ts">
import { currentProject, projects } from '../../store.ts'
import type { ProjectType } from '../../types/types.ts'

let { id } = $props()

let project: ProjectType = $state({
  title: '',
  description: '',
  id: '',
  url: '',
  colors: [],
  pages: [],
  extra: {
    head: '',
    style: '',
  },
})

$effect(() => {
  if ($projects) {
    const found = $projects.find((item) => item.id === id)
    if (found) {
      project = found
    }
  }
})

function save() {
  currentProject.set(project)
  projects.update((items) => {
    if (items) {
      const index = items.findIndex((item) => item.id === project.id)
      if (index !== -1) {
        items[index] = project
      }
    }
    return items
  })
}
</script>

<div>
  {#if id}<span class="text-sm">{id}</span>{/if}
  <label class="label">
    <span>Project title: </span>
    <input type="text" bind:value={project.title} onkeyup={save} />
  </label>

  <label class="label">
    <span>Url: </span>
    <input type="url" bind:value={project.url} onkeyup={save} />
  </label>

  <label class="label">
    <span>Description: </span>
    <textarea bind:value={project.description} onkeyup={save}></textarea>
  </label>

  <label class="label">
    <span>Extra head tags: </span>
    <textarea bind:value={project.extra.head} onkeyup={save}></textarea>
  </label>

  <label class="label">
    <span>Extra styles:(etc. font styles) </span>
    <textarea bind:value={project.extra.style} onkeyup={save}></textarea>
  </label>
</div>

<style>
.label {
  display: flex;
  gap: 4px;
  flex-direction: column;
  margin-block-end: 8px;

  input[type='text'],
  input[type='url'],
  textarea {
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 4px 8px;
  }
  textarea {
    min-height: 200px;
    max-height: 500px;
  }
}
</style>
