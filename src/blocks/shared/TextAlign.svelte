<script lang="ts">
import Select from '../../components/Select.svelte'
import { getStyleEditor } from '../../utils/editor-style.ts'

const { title, id, styleName }: { title: string; id: string; styleName: string } = $props()
const style = getStyleEditor()
</script>

<Select {id} label={`${title}:`} value={style.read(styleName) || 'left'} onchange={(event) => style.set(styleName, event.currentTarget.value)}>
  <option value="left">Left</option>
  <option value="center">Center</option>
  <option value="right">Right</option>
  <option value="justify">Justify</option>
</Select>
