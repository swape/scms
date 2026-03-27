<script lang="ts">
import { userObj } from '../store.ts'
</script>

{#if $userObj?.uid}
  <slot />
{/if}
