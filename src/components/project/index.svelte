<script lang="ts">
import { projects, currentProject as savedProject } from '../../store'
import type { ProjectType } from '../../types/types.ts'
import { getProjectFromLocalStorage } from '../../utils/projects.ts'
import Colors from './Colors.svelte'
import Edit from './Edit.svelte'

// get p parameter from URL
const ID = URLSearchParams ? new URLSearchParams(window.location.search).get('p') : null

let currentProject = $state<ProjectType | null>(null)
let tab = $state('')

const localProject = getProjectFromLocalStorage()
const currentProjectIsInLocalStorage = $derived(String($savedProject?.id) === ID || (localProject !== null && String(localProject.id) === ID))

if (localProject && String(localProject.id) === ID) {
  projects.update((items) => {
    const catalog = items ?? []
    return catalog.some((item) => String(item.id) === ID) ? catalog.map((item) => (String(item.id) === ID ? localProject : item)) : [...catalog, localProject]
  })
}

$effect(() => {
  if ($projects && $projects.length > 0) {
    currentProject = $projects.find((p) => String(p.id) === ID) || null
  }
})

function changeTab(selectedTab: string) {
  tab = selectedTab
}

const tabs = [
  { name: 'Summery', id: '' },
  { name: 'Settings', id: 'settings' },
  { name: 'Colors', id: 'colors' },
  { name: 'Users', id: 'users' },
]
</script>

{#if currentProject}
  {#if currentProject?.id}
    <div class="flex border-b-[0.0625rem] border-slate-700 mb-5">
      {#each tabs as { name, id }}
        <button class={['btn p-3', tab === id ? 'active' : '']} type="button" onclick={() => changeTab(id)}>{name}</button>
      {/each}
    </div>
    <div class="pb-10">
      {#if tab === ''}
        Summery {ID}
        {currentProject.title}
        <div class="mt-5">
          <a href="/editor?p={ID}" class="btn active p-3">Editor</a>
          {#if currentProjectIsInLocalStorage}
            <a href="/editor?p={ID}&local=true" class="btn active p-3">Editor (continue last unsaved)</a>
          {/if}
        </div>
      {/if}

      {#if tab === 'settings'}
        <Edit id={ID} />
      {/if}

      {#if tab === 'colors'}
        <Colors id={ID} />
      {/if}

      {#if tab === 'users'}
        Users {ID}
        {currentProject.title}
      {/if}
    </div>
  {/if}
{/if}
{#if !currentProject?.id}
  Oops! Project not found.
{/if}
