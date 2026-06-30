<script lang="ts">
import { blockPaddingOptions, inlinePaddingOptions, spacingBottomOptions, spacingOptions } from '../../../../constants'
import type { ContentType } from '../../../../types/types'
import SelectWithLabel from '../../../editorParts/SelectWithLabel.svelte'

let { element, onChange }: { element: ContentType; onChange: (elm: ContentType) => void } = $props()
</script>

{#if element.styles?.marginTop !== undefined}
  <SelectWithLabel
    label="Margin top"
    options={spacingOptions}
    selectedValue={element.styles.marginTop ?? ''}
    onchange={(v) => {
      element.styles!.marginTop = v
      onChange(element)
    }} />
{/if}

{#if element.styles?.marginBottom !== undefined}
  <SelectWithLabel
    label="Margin bottom"
    options={spacingBottomOptions}
    selectedValue={element.styles.marginBottom ?? ''}
    onchange={(v) => {
      element.styles!.marginBottom = v
      onChange(element)
    }} />
{/if}

{#if element.styles?.inlinePadding !== undefined}
  <SelectWithLabel
    label="Inline padding"
    options={inlinePaddingOptions}
    selectedValue={element.styles.inlinePadding ?? ''}
    onchange={(v) => {
      element.styles!.inlinePadding = v
      onChange(element)
    }} />
{/if}

{#if element.styles?.blockPadding !== undefined}
  <SelectWithLabel
    label="Block padding"
    options={blockPaddingOptions}
    selectedValue={element.styles.blockPadding ?? ''}
    onchange={(v) => {
      element.styles!.blockPadding = v
      onChange(element)
    }} />
{/if}
