<script>
import { currentProject } from '../../store'
const { selectedPage } = $props()
</script>

<div class="w-full p-4 bg-amber-950">
  <div>page-builder for page: {selectedPage?.id} {selectedPage?.title}</div>
  <textarea class="w-full h-96 border p-2 mt-2">{JSON.stringify($currentProject.content)}</textarea>
</div>
