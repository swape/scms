<script lang="ts">
import Button from '../Button.svelte'

const exampleFiles = [
  { id: '1', name: 'File 1', size: '2 MB', url: 'https://placehold.co/600x400/orange/white', alt: 'File 1', type: 'image/png', parentFolder: '' },
  { id: '2', name: 'File 2', size: '5 MB', url: 'https://placehold.co/800x400/orange/red', alt: 'File 2', type: 'image/png', parentFolder: '' },
  { id: '3', name: 'File 3', size: '1 MB', url: 'https://placehold.co/600x1400/orange/blue', alt: 'File 3', type: 'image/png', parentFolder: 'folder2' },
  { id: '4', name: 'File 4', size: '3 MB', url: 'https://placehold.co/600x400/orange/yellow', alt: 'File 4', type: 'image/png', parentFolder: 'folder1/subfolder' },
  { id: '5', name: 'File 5 that is very long', size: '4 MB', url: 'https://placehold.co/600x400/orange/purple', alt: 'File 5', type: 'image/png', parentFolder: 'folder1' },
]

const { selected } = $props()

let selectedDirectory = $state('')

function getDirFiles(dir: string) {
  return exampleFiles.filter((file) => file.parentFolder === dir)
}

function getDirectories(startDir = '') {
  const directories = new Set<string>()
  exampleFiles.forEach((file) => {
    const dir = file.parentFolder
    if (!dir) {
      return
    }
    if (startDir === '') {
      const segment = dir.split('/')[0]
      if (segment) {
        directories.add(segment)
      }
    } else {
      const prefix = startDir + '/'
      if (dir.startsWith(prefix)) {
        const segment = dir.slice(prefix.length).split('/')[0]
        if (segment) {
          directories.add(segment)
        }
      }
    }
  })
  return Array.from(directories)
}

function goBack() {
  const parts = selectedDirectory.split('/')
  parts.pop()
  selectedDirectory = parts.join('/')
}

function selectFile(fileId: string) {
  const file = exampleFiles.find((f) => f.id === fileId)
  if (file) {
    selected(file)
    // close the popover
    const popover = document.getElementById('file-popover-wrapper')
    if (popover) {
      popover.hidePopover()
    }
  }
}
</script>

<div class="file-selector relative">
  <Button icon="folder_open" popovertarget="file-popover-wrapper">Select file</Button>
  <div popover id="file-popover-wrapper" class="popover">
    <div class="file-selector-content">
      <div class="directory-list">
        <h3>Directories</h3>
        {#if selectedDirectory}
          <Button icon="arrow_back" variant="ghost" fullWidth class="directory-button" onclick={goBack}>Back</Button>
        {/if}

        {#each getDirectories(selectedDirectory) as dir}
          <Button icon="folder" variant="ghost" fullWidth class="directory-button" onclick={() => (selectedDirectory = selectedDirectory ? selectedDirectory + '/' + dir : dir)}>
            {dir}
          </Button>
        {/each}
      </div>
      <div class="file-list">
        <h3>Files</h3>
        <div class="file-grid">
          {#each getDirFiles(selectedDirectory) as file}
            <Button class="file" title={file.name} onclick={() => selectFile(file.id)}>
              <span class="file-preview" style={`background-image: url('${file.url}');`} aria-hidden="true"></span>
              <span class="file-name">{file.name}</span>
            </Button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.popover {
  position-area: bottom;
  right: 0.75rem;
  width: min(37.5rem, calc(100vw - 1.5rem));
  max-height: min(22.5rem, calc(100vh - 1.5rem));
  padding: 0.75rem;
  overflow-y: auto;
  color: var(--ui-text, #f5f5f5);
  background: var(--ui-panel, #2c2c2c);
  border: 0.0625rem solid var(--ui-border, #444);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 24%);
  font-size: 0.75rem;
}

.file-selector-content {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.directory-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  padding-right: 0.75rem;
  border-right: 0.0625rem solid var(--ui-border, #444);
}

.directory-list :global(.directory-button) {
  justify-content: flex-start;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.875rem, 1fr));
  gap: 0.5rem;
}

.file-grid :global(.file) {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  min-width: 0;
}

.file-preview {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  background-size: cover;
  background-position: center;
  border-radius: 0.1875rem;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}

@media (max-width: 30rem) {
  .file-selector-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .directory-list {
    padding-right: 0;
    padding-bottom: 0.75rem;
    border-right: 0;
    border-bottom: 0.0625rem solid var(--ui-border, #444);
  }
}
</style>
