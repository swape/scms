<script lang="ts">
import { untrack } from 'svelte'
import InputWithLabel from '../../editorParts/InputWithLabel.svelte'
import SelectWithLabel from '../../editorParts/SelectWithLabel.svelte'
import TextareaWithLabel from '../../editorParts/TextareaWithLabel.svelte'

let { element, onChange } = $props()
let localElement = $state(untrack(() => structuredClone(element)))

$effect(() => {
  localElement = structuredClone(element)
})
</script>

{#if localElement.settings.type !== 'Paragraph'}
  <InputWithLabel label="Content" inputType="text" bind:value={localElement.content} onchange={() => onChange(localElement)} />
{/if}
{#if localElement.settings.type === 'Paragraph'}
  <TextareaWithLabel label="Content" bind:value={localElement.content} onchange={() => onChange(localElement)} />
{/if}

<InputWithLabel label="Order" inputType="number" bind:value={localElement.order} onchange={() => onChange(localElement)} />

<SelectWithLabel
  label="Type"
  options={localElement.options.elementTypes.map((t: string) => ({
    value: t,
    label: t,
  }))}
  selectedValue={localElement.settings.type}
  onchange={(v) => {
    localElement.settings.type = v
    onChange(localElement)
  }} />
