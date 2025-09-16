<script>
import { userObj } from '../store.js'
</script>

{#if $userObj?.uid}
  <slot />
{/if}
