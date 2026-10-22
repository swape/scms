<script lang="ts">
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps } from '../../types/types.ts'
import ColorSelect from './ColorSelect.svelte'
import { updateStyleColor } from './helper.ts'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

function updateColor(key: 'backgroundColor' | 'textColor', event: Event) {
  updateStyleColor(key, event, $selectedElement?.style, update, updatePageContentWithDebounce)
}
</script>

<ColorSelect
  element={$selectedElement}
  title="Background color"
  id="background-color"
  styleName="backgroundColor"
  update={(event: Event) => updateColor('backgroundColor', event)}
  isBgColors={true} />
<ColorSelect element={$selectedElement} title="Text color" id="text-color" styleName="textColor" update={(event: Event) => updateColor('textColor', event)} isBgColors={false} />
