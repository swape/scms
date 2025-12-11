<script>
import PagesList from './PagesList.svelte'
import ElementSettings from './ElementSettings.svelte'
import { currentProject, projects } from '../../store'

const ID = window.location.search.split('=')[1] || ''

projects.subscribe((value) => {
  if (value && value.length > 0) {
    const project = value.find((p) => p.id === ID) || null
    currentProject.set(project)
  }
})
</script>

<div class="editor">
  {#if $currentProject?.id}
    <div class="pages"><PagesList /></div>
    <div class="page-builder">page-builder</div>
    <div class="settings"><ElementSettings /></div>
  {/if}
</div>
{#if !$currentProject?.id}
  Oops! Project not found.
{/if}

<style>
.editor {
  background-color: black;
  display: flex;
  justify-content: space-between;
  min-height: calc(100vh - 40px - 16px);

  .pages {
    width: 300px;
    border-right: 1px solid #333;
    padding: 10px;
  }

  .settings {
    width: 300px;
    border-left: 1px solid #333;
    padding: 10px;
  }
}
</style>
