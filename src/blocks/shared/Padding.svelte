<script lang="ts">
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import { selectedElement } from '../../store.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'

const style = getStyleEditor()
const paddingMode = $derived(style.read('paddingMode') === 'individual' ? 'individual' : 'all')
</script>

{#key `${$selectedElement?.id}:${style.mode}`}
  <Select id="padding-mode" label="Padding Mode:" value={paddingMode} onchange={(event) => style.set('paddingMode', event.currentTarget.value)}>
    <option value="all">All Sides</option>
    <option value="individual">Individual</option>
  </Select>

  {#if paddingMode === 'all'}
    <SizeInput id="padding-all" label="Padding:" min="0" value={style.read('paddingAll')} onvaluechange={(value) => style.set('paddingAll', value)} />
  {:else}
    <fieldset class="padding-fields">
      <legend>Padding Individual:</legend>
      <div class="padding-grid">
        <SizeInput
          id="padding-top"
          label="Top"
          wrapperClass="grid min-w-0 gap-1"
          min="0"
          value={style.read('paddingTop')}
          onvaluechange={(value) => style.set('paddingTop', value)} />
        <SizeInput
          label="Right"
          wrapperClass="grid min-w-0 gap-1"
          id="padding-right"
          min="0"
          value={style.read('paddingRight')}
          onvaluechange={(value) => style.set('paddingRight', value)} />
        <SizeInput
          label="Bottom"
          wrapperClass="grid min-w-0 gap-1"
          id="padding-bottom"
          min="0"
          value={style.read('paddingBottom')}
          onvaluechange={(value) => style.set('paddingBottom', value)} />
        <SizeInput
          id="padding-left"
          label="Left"
          wrapperClass="grid min-w-0 gap-1"
          min="0"
          value={style.read('paddingLeft')}
          onvaluechange={(value) => style.set('paddingLeft', value)} />
      </div>
    </fieldset>
  {/if}
{/key}

<style>
.padding-fields {
  min-width: 0;
  margin: 0 0 0.75rem;
  padding: 0;
  border: 0;
}

.padding-fields legend {
  margin-bottom: 0.5rem;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
}

.padding-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.padding-grid :global(.ui-field) {
  margin: 0;
}
</style>
