<script lang="ts">
import { parseCssLength } from '../blocks/shared/css.ts'
import type { SizeInputProps, SizeUnit } from '../types/types.ts'
import Input from './Input.svelte'
import Select from './Select.svelte'

const generatedId = $props.id()
const { id = generatedId, label, value, defaultUnit = 'px', allowAuto = false, fallback, onvaluechange, wrapperClass = '', disabled, ...attributes }: SizeInputProps = $props()
let chosenUnit = $state<SizeUnit>()
const parsed = $derived(parseCssLength(value === undefined || value === '' ? fallback : value, defaultUnit))
const isAuto = $derived(allowAuto && value === 'auto')
const unit = $derived(parsed?.unit ?? chosenUnit ?? defaultUnit)
const unitLabel = $derived(`${label.replace(/:\s*$/, '')} unit`)

function changeValue(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  if (!input.value.trim()) {
    chosenUnit = unit === 'em' || unit === '%' ? defaultUnit : unit
    onvaluechange(undefined)
    return
  }
  const number = Number(input.value)
  if (Number.isFinite(number)) {
    onvaluechange(`${number}${unit}`)
  }
}

function changeUnit(event: Event) {
  const nextUnit = (event.currentTarget as HTMLSelectElement).value as SizeUnit | 'auto'
  if (nextUnit === 'auto') {
    onvaluechange('auto')
    return
  }
  chosenUnit = nextUnit
  if (parsed) {
    onvaluechange(`${parsed.value}${nextUnit}`)
  } else if (isAuto) {
    onvaluechange(`0${nextUnit}`)
  }
}
</script>

<div class={['size-input', 'ui-field', wrapperClass]}>
  <Input {id} {label} {...attributes} disabled={disabled || isAuto} type="number" step="any" value={parsed?.value} oninput={changeValue} wrapperClass="size-number" />
  <Select
    id={`${id}-unit`}
    label={unitLabel}
    {disabled}
    value={isAuto ? 'auto' : unit}
    onchange={changeUnit}
    wrapperClass="size-unit"
    title={allowAuto ? 'Choose a unit or Auto' : 'Choose a unit; the number stays the same'}>
    <option value="px">px</option>
    <option value="rem">rem</option>
    <option value="ch">ch</option>
    {#if allowAuto}
      <option value="auto">Auto</option>
    {/if}
    {#if unit === 'em' || unit === '%'}
      <option value={unit} disabled>{unit}</option>
    {/if}
  </Select>
</div>

<style>
.size-input {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem;
  align-items: end;
  gap: 0.25rem;
  min-width: 0;
  margin-bottom: 0.75rem;
}
.size-input :global(.size-number),
.size-input :global(.size-unit) {
  min-width: 0;
  margin: 0;
}
.size-input :global(.size-unit label) {
  position: absolute;
  width: 0.0625rem;
  height: 0.0625rem;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.size-input :global(.size-unit select) {
  padding-inline: 0.375rem 1.25rem;
  background-position: right 0.125rem center;
}
</style>
