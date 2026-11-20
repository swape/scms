<script lang="ts">
import type { ColorPairProps } from '../../types/types.ts'
import Icon from '../Icon.svelte'
import Input from '../Input.svelte'

const { color, onchange }: ColorPairProps = $props()
</script>

<fieldset class="color-pair" data-color-key={color.key}>
  <legend>{color.name || 'Unnamed color'}</legend>
  <Input label="Label" value={color.name} oninput={(event) => onchange(color.key, 'name', event.currentTarget.value)} />
  <div class="color-modes">
    <div class="color-mode">
      <h4><Icon name="light_mode" />Light mode</h4>
      <div class="color-values">
        <Input label="Light color" wrapperClass="color-swatch" type="color" value={color.c} oninput={(event) => onchange(color.key, 'c', event.currentTarget.value)} />
        <Input label="Light value" wrapperClass="color-value" value={color.c} spellcheck={false} oninput={(event) => onchange(color.key, 'c', event.currentTarget.value)} />
      </div>
    </div>
    <div class="color-mode">
      <h4><Icon name="dark_mode" />Dark mode</h4>
      <div class="color-values">
        <Input label="Dark color" wrapperClass="color-swatch" type="color" value={color.cDark} oninput={(event) => onchange(color.key, 'cDark', event.currentTarget.value)} />
        <Input label="Dark value" wrapperClass="color-value" value={color.cDark} spellcheck={false} oninput={(event) => onchange(color.key, 'cDark', event.currentTarget.value)} />
      </div>
    </div>
  </div>
  <p class="color-key">Key: <code>{color.key}</code></p>
</fieldset>

<style>
.color-pair {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  background: var(--ui-panel);
}
legend {
  max-width: 100%;
  padding-inline: 6px;
  font-size: 12px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.color-modes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.color-mode {
  min-width: 0;
}
h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--ui-muted);
}
.color-values {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 6px;
}
.color-values :global(.ui-field) {
  margin: 0;
}
.color-values :global(label) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.color-values :global(input) {
  height: 32px;
}
.color-values :global(.color-value input) {
  font-family: monospace;
}
.color-key {
  margin-top: 12px;
  color: var(--ui-muted);
  font-size: 11px;
}
@media (max-width: 420px) {
  .color-modes {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
