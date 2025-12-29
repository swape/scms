<script>
import { selectedElement } from '../../../store'

let { block } = $props()

function selectThis(elm) {
  $selectedElement = elm
}
</script>

<div class="float-wrapper">
  <button
    onclick={() => selectThis(block)}
    type="button"
    class="selecting-block-button">Select</button>
  <div class="floating-helper">
    <div>
      Block ID: {block.id} | Type: {block.type} | Order: {block.order}
    </div>

    <div>Content: {block.content}</div>
  </div>
</div>
