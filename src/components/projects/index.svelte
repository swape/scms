<script lang="ts">
import { projects } from '../../store'
import { getEmptyProjectStructure } from '../../utils/projects.ts'
import Button from '../Button.svelte'
import Icon from '../Icon.svelte'

function addProject() {
  $projects = [
    {
      ...getEmptyProjectStructure(($projects?.length || 0) + 1),
    },
    ...($projects ?? []),
  ]
}

function gotoProject(pid: string | number) {
  window.location.href = `/project?p=${encodeURIComponent(pid)}`
}
</script>

<section class="app-surface projects-panel" aria-labelledby="projects-heading">
  <div class="projects-heading">
    <div class="projects-title">
      <Icon name="folder_open" />
      <h2 id="projects-heading">Projects</h2>
      <span class="project-count">{$projects?.length ?? 0}</span>
    </div>
    <Button variant="primary" icon="add" onclick={addProject}>New project</Button>
  </div>
  <div class="projects-grid">
    {#each $projects ?? [] as p (p.id)}
      <Button class="project-card" aria-label={`Open project ${p.id}: ${p.title}`} onclick={() => gotoProject(p.id)}>
        <span class="project-cover"><Icon name="web" size={2.25} /></span>
        <span class="project-info">
          <span class="project-name">{p.title}</span>
          <span class="project-description">{p.description}</span>
          <span class="project-meta">Project {p.id}<Icon name="arrow_outward" /></span>
        </span>
      </Button>
    {:else}
      <p class="projects-empty">No projects yet. Create a project to get started.</p>
    {/each}
  </div>
</section>

<style>
.projects-panel {
  overflow: hidden;
}
.projects-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 0.0625rem solid var(--ui-border);
}
.projects-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.projects-title h2 {
  font-weight: 600;
  font-size: 0.75rem;
}
.project-count {
  color: var(--ui-muted);
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 13.75rem), 1fr));
  gap: 1rem;
  padding: 1.25rem;
}
.projects-grid :global(.project-card) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 0;
  padding: 0;
  min-width: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  text-align: left;
}
.project-cover {
  display: grid;
  place-items: center;
  height: 8.25rem;
  background: #242424;
  color: var(--ui-muted);
  border-bottom: 0.0625rem solid var(--ui-border);
}
.project-info {
  display: grid;
  gap: 0.375rem;
  padding: 0.875rem;
}
.project-name {
  font-size: 0.8125rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.project-description {
  color: var(--ui-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.project-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: var(--ui-muted);
  font-size: 0.6875rem;
}
.projects-empty {
  color: var(--ui-muted);
  grid-column: 1 / -1;
  padding: 1.5rem 0;
  text-align: center;
}
@media (max-width: 37.5rem) {
  .projects-heading {
    padding: 0.75rem;
  }
  .projects-grid {
    padding: 0.75rem;
    gap: 0.75rem;
  }
}
</style>
