<script lang="ts">
import type { PageType } from '../../../types/types'
import InputWithLabel from '../../editorParts/InputWithLabel.svelte'

let { element, onChange } = $props<{ element: PageType; onChange: (el: PageType) => void }>()
let localElement = $state<PageType | undefined>(undefined)

$effect(() => {
  localElement = structuredClone(element)
})
</script>

{#if localElement}
  <InputWithLabel label="Title" inputType="text" bind:value={localElement.title} onchange={() => onChange(localElement!)} />

  <InputWithLabel label="Order" inputType="number" bind:value={localElement.order} onchange={() => onChange(localElement!)} />
{/if}
