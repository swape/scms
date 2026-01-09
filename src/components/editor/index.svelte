<script>
import {
  currentProject,
  projects,
  selectedElement,
  selectedPage,
} from '../../store'
import ElementSettings from './ElementSettings.svelte'
import PagesList from './PagesList.svelte'

const ID = window.location.search.split('=')[1] || ''

projects.subscribe((value) => {
  if (value && value.length > 0) {
    const project = value.find((p) => p.id === ID) || null
    currentProject.set(project)
  }
})

selectedElement.subscribe((value) => {
  if (value && value.type === 'page') {
    $selectedPage = value
  }
})
</script>

<div class="container mx-auto">
  <div class="flex justify-between items-center border-t">
    <h1 class="text-xl font-bold my-4">
      Project: {$currentProject?.title || 'No Project Selected'}
    </h1>
    <div><button class="btn active p-2">Publish Project</button></div>
  </div>
</div>
<div class="editor">
  {#if $currentProject?.id}
    <div class="pages"><PagesList /></div>
    <div class="page-builder">
      <iframe
        src={`/pagePreview?p=${ID}`}
        title="Page Preview"
        width="100%"
        height="100%"
        frameborder="0"
        style="background-color: white;"></iframe>
    </div>
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

  .page-builder {
    width: 100%;
    overflow: auto;
  }
}
</style>
