<script lang="ts">
import Select from '../../components/Select.svelte'
import { currentProject } from '../../store.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'

const { title, id, styleName, isBgColors = true }: { title: string; id: string; styleName: string; isBgColors?: boolean } = $props()
const style = getStyleEditor()
const colors = $derived(($currentProject?.colors ?? []).filter((color) => color.key.startsWith(isBgColors ? 'bg_' : 'text_')))
</script>

<Select {id} label={`${title}:`} value={style.read(styleName) ?? ''} onchange={(event) => style.set(styleName, event.currentTarget.value)}>
  {#each colors as color}
    <option value={color.key}>{color.name}</option>
  {/each}
  <option value="">None</option>
</Select>
