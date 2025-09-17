<script>
const ID = window.location.search.split('=')[1]

import { projects } from '../../store'

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
</script>

{#if currentProject?.id}
  <div class="flex border-b border-slate-700 mb-5">
    <button class={['btn p-3', tab === '' ? 'active' : '']} type="button" onclick={() => changeTab('')}>Summery</button>
    <button class={['btn p-3', tab === 'settings' ? 'active' : '']} type="button" onclick={() => changeTab('settings')}>Settings</button>
    <button class={['btn p-3', tab === 'users' ? 'active' : '']} type="button" onclick={() => changeTab('users')}>Users</button>
  </div>
  {#if tab === ''}
    <div>
      Summery {ID}
      {currentProject.title}
    </div>
  {/if}

  {#if tab === 'settings'}
    <div>
      Settings {ID}
      {currentProject.title}
    </div>
  {/if}

  {#if tab === 'users'}
    <div>
      Users {ID}
      {currentProject.title}
    </div>
  {/if}
{/if}
{#if !currentProject?.id}
  Oops! Project not found.
{/if}
