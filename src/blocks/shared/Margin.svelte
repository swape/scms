<script lang="ts">
import SizeInput from '../../components/SizeInput.svelte'
import { selectedElement } from '../../store.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'

const style = getStyleEditor()
</script>

{#key `${$selectedElement?.id}:${style.mode}`}
  <fieldset class="margin-fields">
    <legend>Margin Block:</legend>
    <div class="margin-grid">
      <SizeInput id="margin-top" label="Top" wrapperClass="grid min-w-0 gap-1" value={style.read('marginTop')} onvaluechange={(value) => style.set('marginTop', value)} />
      <SizeInput
        id="margin-bottom"
        label="Bottom"
        wrapperClass="grid min-w-0 gap-1"
        value={style.read('marginBottom')}
        onvaluechange={(value) => style.set('marginBottom', value)} />
    </div>
  </fieldset>
  <fieldset class="margin-fields">
    <legend>Margin Inline:</legend>
    <div class="margin-grid">
      <SizeInput
        id="margin-inline-start"
        label="Start"
        allowAuto
        wrapperClass="grid min-w-0 gap-1"
        value={style.read('marginInlineStart')}
        onvaluechange={(value) => style.set('marginInlineStart', value)} />
      <SizeInput
        id="margin-inline-end"
        label="End"
        allowAuto
        wrapperClass="grid min-w-0 gap-1"
        value={style.read('marginInlineEnd')}
        onvaluechange={(value) => style.set('marginInlineEnd', value)} />
    </div>
  </fieldset>
{/key}

<style>
.margin-fields {
  min-width: 0;
  margin: 0 0 0.75rem;
  padding: 0;
  border: 0;
}

.margin-fields legend {
  margin-bottom: 0.5rem;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
}

.margin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.margin-grid :global(.ui-field) {
  margin: 0;
}
</style>
