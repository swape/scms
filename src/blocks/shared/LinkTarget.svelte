<script lang="ts">
import Select from '../../components/Select.svelte'
import type { LinkSettings, LinkTarget } from '../../types/types.ts'

interface Props {
  id: string
  link?: LinkSettings
  onchange: (change: (link: LinkSettings) => void) => void
}

const { id, link, onchange }: Props = $props()
</script>

<Select
  {id}
  label="Target:"
  value={link?.target ?? '_self'}
  onchange={(event) =>
    onchange((next) => {
      next.target = event.currentTarget.value as LinkTarget
    })}>
  <option value="_self">Same tab</option>
  <option value="_blank">New tab</option>
</Select>
