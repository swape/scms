<script lang="ts">
import { untrack } from 'svelte'
import InputWithLabel from '../../editorParts/InputWithLabel.svelte'

let { element, onChange } = $props()
let localElement = $state(untrack(() => structuredClone(element)))

$effect(() => {
  localElement = structuredClone(element)
})
</script>

<InputWithLabel
  label="Title"
  inputType="text"
  bind:value={localElement.title}
  onchange={() => onChange(localElement)} />

<InputWithLabel
  label="Order"
  inputType="number"
  bind:value={localElement.order}
  onchange={() => onChange(localElement)} />
