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
  right: 12px;
  width: min(600px, calc(100vw - 24px));
  max-height: min(360px, calc(100vh - 24px));
  padding: 12px;
  overflow-y: auto;
  color: var(--ui-text, #f5f5f5);
  background: var(--ui-panel, #2c2c2c);
  border: 1px solid var(--ui-border, #444);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 24%);
  font-size: 12px;
}

.file-selector-content {
  display: grid;
  grid-template-columns: 144px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

h3 {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
}

.directory-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-right: 12px;
  border-right: 1px solid var(--ui-border, #444);
}

.directory-list :global(.directory-button) {
  justify-content: flex-start;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
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
  border-radius: 3px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}

@media (max-width: 480px) {
  .file-selector-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .directory-list {
    padding-right: 0;
    padding-bottom: 12px;
    border-right: 0;
    border-bottom: 1px solid var(--ui-border, #444);
  }
}
</style>
