<script lang="ts">
import { selectedElement } from '../../../../store.ts'
import type { ContentType } from '../../../../types/types.ts'

const { updatePageContentWithDebounce } = $props()

function updateContent(event: Event) {
  const textarea = event.target as HTMLTextAreaElement
  selectedElement.update((element) => {
    if (element) {
      ;(element as ContentType).content = textarea.value
    }
    updatePageContentWithDebounce()
    return element
  })
}

function updateTitle(event: Event) {
  const input = event.target as HTMLInputElement
  selectedElement.update((element) => {
    if (element) {
      element.title = input.value.slice(0, 100)
    }
    updatePageContentWithDebounce()
    return element
  })
}
</script>

<div class="input-and-label-wrapper">
  <label for="text-title">Title:</label>
  <input id="text-title" type="text" value={$selectedElement?.title || ''} oninput={updateTitle} />
</div>

<div class="input-and-label-wrapper">
  <label for="text-content">Content:</label>
  <textarea id="text-content" rows="6" value={($selectedElement as ContentType)?.content || ''} oninput={updateContent}></textarea>
</div>
