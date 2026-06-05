<script>
import { selectedElement } from '../../../store'

let { block } = $props()

let isSelected = $derived($selectedElement?.id === block?.id)

function selectThis(elm) {
  $selectedElement = elm
}
</script>

<div class={`float-wrapper${isSelected ? ' is-selected' : ''}`}>
  <button onclick={() => selectThis(block)} type="button" class="selecting-block-button">Select</button>
  <div class="helper-info">
    Type: {block.label}
  </div>
</div>
