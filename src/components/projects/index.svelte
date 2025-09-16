<script>
import { projects } from '../../store'

function addProject() {
  $projects = [{ id: $projects.length + 1, title: 'new one', description: 'Brand new project' }, ...$projects]
}

function gotoProject(pid) {
  window.location.href = `/project?p=${pid}`
}
</script>

<div class="flex justify-between gap-3 mb-3">
  <h2 class="text-2xl">Projects</h2>
  <button type="button" onclick={addProject} class="btn rounded-full flex justify-center items-center w-[36px] h-[36px]">+</button>
</div>
<div class="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {#each $projects as p}
    <button class="p-5 w-full btn" type="button" onclick={() => gotoProject(p.id)}>
      <div class="text-xs">{p.id}</div>
      <div class="text-xl">{p.title}</div>
      <div class="text-truncate line-clamp-1 text-md">
        {p.description}
      </div>
    </button>
  {/each}
</div>
