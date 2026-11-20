<script lang="ts">
import { currentProject, projects } from '../../store.ts'
import type { ProjectType } from '../../types/types.ts'
import Input from '../Input.svelte'
import Textarea from '../Textarea.svelte'
import Fonts from './Fonts.svelte'

let { id } = $props()

let project: ProjectType = $state({
  title: '',
  description: '',
  id: '',
  url: '',
  colors: [],
  pages: [],
  menu: {
    type: 'menu1',
    elements: [],
  },
  footer: {
    type: 'footer1',
    elements: [],
  },
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
  <Input label="Project title:" wrapperClass="flex flex-col gap-1 mb-2" bind:value={project.title} onkeyup={save} />
  <Input label="Url:" wrapperClass="flex flex-col gap-1 mb-2" type="url" bind:value={project.url} onkeyup={save} />

  <Textarea label="Description:" class="project-textarea" bind:value={project.description} onkeyup={save} />
  <Fonts
    extra={project.extra}
    onchange={(extra) => {
      project.extra = extra
      save()
    }} />
  <Textarea label="Extra head tags:" class="project-textarea" bind:value={project.extra.head} onkeyup={save} />
  <Textarea label="Extra styles:" class="project-textarea" bind:value={project.extra.style} onkeyup={save} />
</div>

<style>
div :global(.project-textarea) {
  min-height: 12.5rem;
  max-height: 31.25rem;
}
</style>
