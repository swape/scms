<script lang="ts">
import Input from '../../components/Input.svelte'
import Select from '../../components/Select.svelte'
import { currentProject } from '../../store.ts'
import type { LinkMode, LinkSettings } from '../../types/types.ts'

interface Props {
  idPrefix: string
  link?: LinkSettings
  onchange: (change: (link: LinkSettings) => void) => void
  modeLabel?: string
}

const { idPrefix, link, onchange, modeLabel = 'Destination type:' }: Props = $props()
</script>

<Select
  id={`${idPrefix}-mode`}
  label={modeLabel}
  value={link?.mode ?? 'url'}
  onchange={(event) =>
    onchange((next) => {
      next.mode = event.currentTarget.value as LinkMode
    })}>
  <option value="url">URL</option>
  <option value="page">Page</option>
</Select>
{#if (link?.mode ?? 'url') === 'url'}
  <Input
    id={`${idPrefix}-url`}
    label="URL:"
    type="url"
    placeholder="https://example.com"
    value={link?.url ?? ''}
    oninput={(event) =>
      onchange((next) => {
        next.url = event.currentTarget.value.trim()
      })} />
{:else}
  <Select
    id={`${idPrefix}-page`}
    label="Page:"
    value={link?.pageId ?? ''}
    onchange={(event) =>
      onchange((next) => {
        next.pageId = event.currentTarget.value
      })}>
    {#each $currentProject?.pages ?? [] as page}
      <option value={page.id}>{page.title}</option>
    {/each}
  </Select>
{/if}
