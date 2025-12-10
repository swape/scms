<script>
const ID = window.location.search.split('=')[1] || ''

import { projects } from '../../store'

let currentProject = $state({})

projects.subscribe((value) => {
  if (value && value.length > 0) {
    currentProject = value.find((p) => p.id === ID) || {}
  }
})
</script>

<div class="editor">
  {#if currentProject?.id}
    Hello
  {/if}
</div>
{#if !currentProject?.id}
  Oops! Project not found.
{/if}

<style>
.editor {
  background-color: black;
}
</style>
