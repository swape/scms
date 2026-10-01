<script lang="ts">
import { selectedElement } from '../../../store.ts'
import ColorSelect from './ColorSelect.svelte'

const { updatePageContentWithDebounce, update } = $props()

function updateBackgroundColor(event: Event) {
  const input = event.target as HTMLInputElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, backgroundColor: input.value })
  updatePageContentWithDebounce()
}

function updateTextColor(event: Event) {
  const input = event.target as HTMLInputElement
  const style = $selectedElement?.style || {}
  update('style', { ...style, textColor: input.value })
  updatePageContentWithDebounce()
}
</script>

<ColorSelect element={$selectedElement} title="Background color" id="background-color" styleName="backgroundColor" update={updateBackgroundColor} isBgColors={true} />
<ColorSelect element={$selectedElement} title="Text color" id="text-color" styleName="textColor" update={updateTextColor} isBgColors={false} />
