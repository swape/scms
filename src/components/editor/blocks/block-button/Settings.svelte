<script lang="ts">
import { untrack } from 'svelte'
import InputWithLabel from '../../../editorParts/InputWithLabel.svelte'
import SelectWithLabel from '../../../editorParts/SelectWithLabel.svelte'

let { element, onChange } = $props()
let localElement = $state(untrack(() => ({ ...element })))

$effect(() => {
  localElement = element && { ...element }
})

const targetOptions = [
  { value: '_self', label: 'Same tab' },
  { value: '_blank', label: 'New tab' },
]
</script>

<InputWithLabel label="Label" inputType="text" bind:value={localElement.content} onchange={() => onChange(localElement)} />

<InputWithLabel label="URL" inputType="text" bind:value={localElement.settings.href} onchange={() => onChange(localElement)} />

<SelectWithLabel
  label="Target"
  options={targetOptions}
  selectedValue={localElement.settings.target}
  onchange={(v) => {
    localElement.settings.target = v
    onChange(localElement)
  }} />

<InputWithLabel label="Order" inputType="number" bind:value={localElement.order} onchange={() => onChange(localElement)} />
