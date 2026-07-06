<script lang="ts">
import { selectedElement } from '../../../../store.ts'
import type { ContentType } from '../../../../types/types.ts'

const { updatePageContentWithDebounce, update } = $props()

function updateContent(event: Event) {
  const input = event.target as HTMLInputElement
  update('content', input.value)
  updatePageContentWithDebounce()
}

function updateLevel(event: Event) {
  const select = event.target as HTMLSelectElement
  update('headerLevel', select.value)
  updatePageContentWithDebounce()
}
</script>

<div class="input-and-label-wrapper">
  <label for="header-level">Level:</label>
  <select id="header-level" value={($selectedElement?.headerLevel as string) || 'h2'} onchange={updateLevel}>
    <option value="h1">H1</option>
    <option value="h2">H2</option>
    <option value="h3">H3</option>
    <option value="h4">H4</option>
    <option value="h5">H5</option>
    <option value="h6">H6</option>
  </select>
</div>

<div class="input-and-label-wrapper">
  <label for="header-content">Text:</label>
  <input id="header-content" type="text" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent} />
</div>
