<script lang="ts">
import { tick } from 'svelte'
import { currentProject, projects } from '../../store.ts'
import type { ColorType, ProjectColorKind } from '../../types/types.ts'
import { getNewProjectColor } from '../../utils/projects.ts'
import Button from '../Button.svelte'
import PanelSection from '../PanelSection.svelte'
import ColorPair from './ColorPair.svelte'

const { id }: { id: string | null } = $props()
const project = $derived($projects?.find((item) => String(item.id) === id))
const colors = $derived(project?.colors ?? [])
const groups = $derived([
  { title: 'Background colors', kind: 'background' as const, colors: colors.filter((color) => color.key.startsWith('bg_')) },
  { title: 'Text colors', kind: 'text' as const, colors: colors.filter((color) => color.key.startsWith('text_')) },
])
const otherColors = $derived(colors.filter((color) => !color.key.startsWith('bg_') && !color.key.startsWith('text_')))
let palette: HTMLDivElement | undefined = $state()

function saveColors(nextColors: ColorType[]) {
  if (!project) {
    return
  }
  const updated = { ...project, colors: nextColors }
  projects.update((items) => items?.map((item) => (item.id === updated.id ? updated : item)) ?? [])
  currentProject.set(updated)
}

function changeColor(key: string, field: 'name' | 'c' | 'cDark', value: string) {
  saveColors(colors.map((color) => (color.key === key ? { ...color, [field]: value } : color)))
}

async function addColor(kind: ProjectColorKind) {
  const color = getNewProjectColor(colors, kind)
  saveColors([...colors, color])
  await tick()
  const label = palette?.querySelector<HTMLInputElement>(`[data-color-key="${color.key}"] input`)
  label?.focus()
  label?.select()
}
</script>

{#if project}
  <div class="palette" bind:this={palette}>
    <header class="palette-heading">
      <h2>Colors for {project.title}</h2>
      <p>Give each color a useful label and choose its light and dark values. Labels appear in the editor's color selectors.</p>
    </header>
    {#each groups as group (group.kind)}
      <PanelSection title={group.title}>
        {#snippet actions()}
          <Button icon="add" aria-label={`Add ${group.kind} color pair`} onclick={() => addColor(group.kind)}>Add color pair</Button>
        {/snippet}
        <div class="palette-grid">
          {#each group.colors as color (color.key)}
            <ColorPair {color} onchange={changeColor} />
          {:else}
            <p class="palette-empty">No {group.kind} colors yet. Add a light/dark pair to get started.</p>
          {/each}
        </div>
      </PanelSection>
    {/each}
    {#if otherColors.length > 0}
      <PanelSection title="Other colors">
        <div class="palette-grid">
          {#each otherColors as color (color.key)}
            <ColorPair {color} onchange={changeColor} />
          {/each}
        </div>
      </PanelSection>
    {/if}
  </div>
{/if}

<style>
.palette-heading h2 {
  font-size: 18px;
  font-weight: 600;
}
.palette-heading p {
  max-width: 64ch;
  margin-top: 6px;
  color: var(--ui-muted);
  font-size: 12px;
}
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: 16px;
}
.palette-empty {
  color: var(--ui-muted);
  padding: 12px 0;
}
</style>
