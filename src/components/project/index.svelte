<script>
import { projects } from '../../store'
import Edit from './Edit.svelte'

const ID = window.location.search.split('=')[1] || ''

let currentProject = $state({})
let tab = $state('')

projects.subscribe((value) => {
  if (value && value.length > 0) {
    currentProject = value.find((p) => p.id === ID) || {}
  }
})

function changeTab(selectedTab) {
  tab = selectedTab
}

const tabs = [
  { name: 'Summery', id: '' },
  { name: 'Settings', id: 'settings' },
  { name: 'Users', id: 'users' },
]
</script>

{#if currentProject?.id}
  <div class="flex border-b border-slate-700 mb-5">
    {#each tabs as { name, id }}
      <button
        class={['btn p-3', tab === id ? 'active' : '']}
        type="button"
        onclick={() => changeTab(id)}>{name}</button>
    {/each}
  </div>
  <div>
    {#if tab === ''}
      Summery {ID}
      {currentProject.title}
      <div class="mt-5">
        <a href="/editor?p={ID}" class="btn active p-3">Editor</a>
      </div>
    {/if}

    {#if tab === 'settings'}
      <Edit id={ID} />
    {/if}

    {#if tab === 'users'}
      Users {ID}
      {currentProject.title}
    {/if}
  </div>
{/if}
{#if !currentProject?.id}
  Oops! Project not found.
{/if}
