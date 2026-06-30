<script lang="ts">
import { textAlignOptions, widthOptions } from '../../../../constants'
import type { ContentType } from '../../../../types/types'
import SelectWithLabel from '../../../editorParts/SelectWithLabel.svelte'

let { element, onChange }: { element: ContentType; onChange: (elm: ContentType) => void } = $props()
</script>

{#if element.styles?.blockWidth !== undefined}
  <SelectWithLabel
    label="Block width"
    options={widthOptions}
    selectedValue={element.styles.blockWidth ?? ''}
    onchange={(v) => {
      element.styles!.blockWidth = v
      onChange(element)
    }} />
{/if}

{#if element.styles?.textAlign !== undefined}
  <SelectWithLabel
    label="Text Align"
    options={textAlignOptions}
    selectedValue={element.styles.textAlign ?? ''}
    onchange={(v) => {
      element.styles!.textAlign = v
      onChange(element)
    }} />
{/if}
