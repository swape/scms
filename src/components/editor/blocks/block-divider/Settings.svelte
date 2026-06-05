<script lang="ts">
import { untrack } from 'svelte'
import InputWithLabel from '../../../editorParts/InputWithLabel.svelte'

let { element, onChange } = $props()
let localElement = $state(untrack(() => ({ ...element })))

$effect(() => {
  localElement = { ...element }
})
</script>

<InputWithLabel label="Order" inputType="number" bind:value={localElement.order} onchange={() => onChange(localElement)} />
