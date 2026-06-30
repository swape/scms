<script lang="ts">
import {
  borderColorOptions,
  borderRadiusOptions,
  borderWidthOptions,
  buttonBorderColorOptions,
  buttonBorderRadiusOptions,
  buttonBorderWidthOptions,
  cornerShapeOptions,
} from '../../../../constants'
import type { ContentType } from '../../../../types/types'
import SelectWithLabel from '../../../editorParts/SelectWithLabel.svelte'

let { element, onChange }: { element: ContentType; onChange: (elm: ContentType) => void } = $props()
</script>

{#if element.styles?.borderRadius !== undefined}
  <SelectWithLabel
    label="Border Radius"
    options={element.type === 'block-button' ? buttonBorderRadiusOptions : borderRadiusOptions}
    selectedValue={element.styles.borderRadius ?? ''}
    onchange={(v) => {
      element.styles!.borderRadius = v
      onChange(element)
    }} />
{/if}

{#if element.styles?.borderWidth !== undefined}
  <SelectWithLabel
    label="Border Width"
    options={element.type === 'block-button' ? buttonBorderWidthOptions : borderWidthOptions}
    selectedValue={element.styles.borderWidth ?? ''}
    onchange={(v) => {
      element.styles!.borderWidth = v
      onChange(element)
    }} />
{/if}

{#if element.styles?.cornerShape !== undefined}
  <SelectWithLabel
    label="Corner Shape"
    options={cornerShapeOptions}
    selectedValue={element.styles.cornerShape ?? ''}
    onchange={(v) => {
      element.styles!.cornerShape = v
      onChange(element)
    }} />
{/if}

{#if element.colors?.borderColorKey !== undefined}
  <SelectWithLabel
    label="Border Color"
    options={element.type === 'block-button' ? buttonBorderColorOptions : borderColorOptions}
    selectedValue={element.colors.borderColorKey ?? ''}
    onchange={(v) => {
      element.colors!.borderColorKey = v
      onChange(element)
    }} />
{/if}
