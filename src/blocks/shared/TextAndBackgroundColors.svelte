<script lang="ts">
import ColorSelect from './ColorSelect.svelte'
</script>

<ColorSelect title="Background color" id="background-color" styleName="backgroundColor" isBgColors={true} />
<ColorSelect title="Text color" id="text-color" styleName="textColor" isBgColors={false} />
