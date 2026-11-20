<script lang="ts">
import type { ProjectType } from '../../types/types.ts'
import { projectFontGroups, readProjectFonts, updateProjectFonts } from '../../utils/project-fonts.ts'
import PanelSection from '../PanelSection.svelte'
import Select from '../Select.svelte'

const { extra, onchange }: { extra: ProjectType['extra']; onchange: (extra: ProjectType['extra']) => void } = $props()
const selections = $derived(readProjectFonts(extra.style))
const roles = [
  { key: 'headings', label: 'Headings and titles' },
  { key: 'body', label: 'Body text' },
] as const
</script>

<PanelSection title="Fonts">
  <p>These choices add a Google Fonts link and CSS to the fields below. Choose “Use existing styles” to remove a font choice.</p>
  <div class="font-fields">
    {#each roles as { key, label } (key)}
      <Select {label} value={selections[key]} onchange={(event) => onchange(updateProjectFonts(extra, { ...selections, [key]: event.currentTarget.value }))}>
        <option value="">Use existing styles</option>
        {#each projectFontGroups as { label: group, fonts } (group)}
          <optgroup label={group}>
            {#each fonts as [name] (name)}
              <option value={name}>{name}</option>
            {/each}
          </optgroup>
        {/each}
      </Select>
    {/each}
  </div>
</PanelSection>

<style>
p {
  margin: 0 0 0.75rem;
  color: var(--ui-muted);
}

.font-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: 0 0.75rem;
}
</style>
