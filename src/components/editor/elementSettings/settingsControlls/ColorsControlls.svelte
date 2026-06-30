<script lang="ts">
import { colorOptions, textColorOptions } from '../../../../constants'
import type { ContentType } from '../../../../types/types'
import SelectWithLabel from '../../../editorParts/SelectWithLabel.svelte'

let { element, onChange }: { element: ContentType; onChange: (elm: ContentType) => void } = $props()
</script>

{#if element.colors?.backgroundColorKey !== undefined}
  <SelectWithLabel
    label="Background Color"
    options={colorOptions}
    selectedValue={element.colors.backgroundColorKey ?? ''}
    onchange={(v) => {
      element.colors!.backgroundColorKey = v
      onChange(element)
    }} />
{/if}

{#if element.colors?.textColorKey !== undefined}
  <SelectWithLabel
    label="Text Color"
    options={textColorOptions}
    selectedValue={element.colors.textColorKey ?? ''}
    onchange={(v) => {
      element.colors!.textColorKey = v
      onChange(element)
    }} />
{/if}
