<script lang="ts">
import Select from '../../components/Select.svelte'

interface Props {
  id: string
  value: string
  onchange: (value: string) => void
  label?: string
  maxLevel?: number
}

const { id, value, onchange, label = 'Heading level:', maxLevel = 6 }: Props = $props()
const levels = $derived(Array.from({ length: maxLevel }, (_, index) => `h${index + 1}`))
</script>

<Select {id} {label} {value} onchange={(event) => onchange(event.currentTarget.value)}>
  {#each levels as level}
    <option value={level}>{level.toUpperCase()}</option>
  {/each}
</Select>
