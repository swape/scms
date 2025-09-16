<script>
const ID = window.location.search.split('=')[1]

import { projects } from '../../store'

let currentProject = $state({})

projects.subscribe((value) => {
  if (value && value.length > 0) {
    currentProject = value.find((p) => p.id === ID) || {}
  }
})

// TODO: show tabs for project settings and users
</script>

{#if currentProject?.id}
  {ID}
  {currentProject.title}
{/if}
{#if !currentProject?.id}
  Oops! Project not found.
{/if}
