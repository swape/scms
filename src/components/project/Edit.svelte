<script>
import { projects } from '../../store.js'

let { id } = $props()

let project = $state({
  title: '',
  description: '',
})

projects.subscribe((value) => {
  if (value) {
    const found = value.find((item) => item.id === id)
    if (found) {
      project = found
    }
  }
})

function save() {
  // TODO: do some validation
  // TODO: save to database and then refresh projects in $store
  console.log({ p: project })
}
</script>

<div>
  {#if id}<span class="text-sm">{id}</span>{/if}
  <label class="label">
    <span>Project title: </span>
    <input type="text" bind:value={project.title} />
  </label>

  <label class="label">
    <span>Url: </span>
    <input type="url" bind:value={project.url} />
  </label>

  <label class="label">
    <span>Description: </span>
    <textarea bind:value={project.description}></textarea>
  </label>

  <div class="flex gap-2 flex-wrap justify-between">
    <button type="button" class="btn p-3 active w-30" onclick={() => save()}
      >Save</button>
    <button type="button" class="btn p-3 w-30">Cancel</button>
  </div>
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
