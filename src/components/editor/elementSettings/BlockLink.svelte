<script lang="ts">
import { untrack } from 'svelte'
import InputWithLabel from '../../editorParts/InputWithLabel.svelte'
import SelectWithLabel from '../../editorParts/SelectWithLabel.svelte'

let { element, onChange } = $props()
let localElement = $state(untrack(() => structuredClone(element)))

$effect(() => {
  localElement = structuredClone(element)
})

const targetOptions = [
  { value: '_self', label: 'Same tab' },
  { value: '_blank', label: 'New tab' },
]

const underlineOptions = [
  { value: 'underline', label: 'Underline' },
  { value: 'no-underline', label: 'No underline' },
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

<SelectWithLabel
  label="Underline"
  options={underlineOptions}
  selectedValue={localElement.settings.underline ?? 'underline'}
  onchange={(v) => {
    localElement.settings.underline = v
    onChange(localElement)
  }} />

<InputWithLabel label="Order" inputType="number" bind:value={localElement.order} onchange={() => onChange(localElement)} />
