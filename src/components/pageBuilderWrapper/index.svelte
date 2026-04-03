<script lang="ts">
import { getStorage, saveStorage } from '../../localstorage'
import { currentProject, isDarkMode, selectedElement, selectedPage } from '../../store'
import PageBuilder from '../editor/PageBuilder.svelte'

// listen to localstorage changes to update selectedPage
$effect(() => {
  function handleStorage(event: StorageEvent) {
    if (event.key === 'selectedPage') {
      const selectedFromStorage = getStorage('selectedPage')
      if (selectedFromStorage) {
        $selectedPage = selectedFromStorage
      }
    } else if (event.key === 'currentProject') {
      const projectFromStorage = getStorage('currentProject')
      if (projectFromStorage) {
        $currentProject = projectFromStorage
      }
    } else if (event.key === 'darkMode') {
      const darkModeFromStorage = getStorage('darkMode')
      if (darkModeFromStorage !== null) {
        $isDarkMode = darkModeFromStorage
      }
    }
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
})

$effect(() => {
  const el = $selectedElement as { type?: string } | null
  if (el && el.type !== 'page') {
    saveStorage('selectedElement', el)
  }
})
</script>

<PageBuilder selectedPage={$selectedPage} />
