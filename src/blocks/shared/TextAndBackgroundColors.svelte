<script lang="ts">
import ColorSelect from './ColorSelect.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import { getStyleEditor } from '../../utils/editor-style.ts'

const style = getStyleEditor()
</script>

<ColorSelect title="Background color" id="background-color" styleName="backgroundColor" isBgColors={true} />
<ColorSelect title="Text color" id="text-color" styleName="textColor" isBgColors={false} />
<SizeInput
  id="border-radius"
  label="Border radius:"
  wrapperClass="grid min-w-0 gap-1"
  value={style.read('borderRadius')}
  onvaluechange={(value) => style.set('borderRadius', value)} />
