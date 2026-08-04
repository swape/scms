<script lang="ts">
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
  <button class="btn btn-primary px-4 py-2" popovertarget="file-popover-wrapper">Select file</button>
  <div popover id="file-popover-wrapper" class="popover w-full bg-slate-800 border border-gray-800 rounded shadow-lg p-4 text-gray-200">
    <div class="file-selector-content">
      <div class="directory-list">
        <p class="text-gray-500 text-sm mb-3">Directories</p>
        {#if selectedDirectory}
          <button onclick={goBack} class="btn flex items-center gap-1 px-3 py-1.5 border border-gray-700 rounded hover:border-gray-400 text-sm">
            <span class="material-symbols-outlined text-base">arrow_back</span>
            Back
          </button>
        {/if}

        {#each getDirectories(selectedDirectory) as dir}
          <button class="btn flex items-center gap-1 px-3 py-1.5" onclick={() => (selectedDirectory = selectedDirectory ? selectedDirectory + '/' + dir : dir)}>
            <span class="material-symbols-outlined text-base">folder</span>
            {dir}
          </button>
        {/each}
      </div>
      <div class="file-list">
        <p class="text-gray-500 text-sm mb-3">Files</p>
        <div class="file-grid">
          {#each getDirFiles(selectedDirectory) as file}
            <button class="file" onclick={() => selectFile(file.id)}>
              <span class="w-full h-25" style={`background-image: url('${file.url}'); background-size: cover; background-position: center;`}> </span>
              <span class="file-name">{file.name}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.popover {
  position-area: bottom;
  right: 10px;
  max-width: 600px;
  max-height: 300px;
  overflow-y: auto;

  .file-selector-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    color: #e5e7eb;
    background-color: #1e293b;
    border-radius: 1rem;
  }

  .directory-list {
    min-width: 150px;
    border-right: 1px solid #374151;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
    padding: 12px;
  }
  .file-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    flex: 1;
    width: 100%;
    padding: 12px;
  }
  .file-list {
    margin-top: 12px;
  }
  .file {
    cursor: pointer;
    width: 130px;
    height: 130px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .file-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 130px;
      text-align: center;
    }
  }
}
</style>
