<script lang="ts">
import type { IconProps } from '../types/types.ts'

const { name, size = 1 }: IconProps = $props()
</script>

<span class="ui-icon" aria-hidden="true" style:font-size={`${size}rem`} style:width={`${size}rem`} style:height={`${size}rem`}>{name}</span>

<style>
.ui-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  font-feature-settings: 'liga';
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  pointer-events: none;
}
</style>
