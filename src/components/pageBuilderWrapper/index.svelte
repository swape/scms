<script>
import { getStorage, saveStorage } from '../../localstorage'
import { currentProject, selectedElement, selectedPage } from '../../store'
import PageBuilder from '../editor/PageBuilder.svelte'

// listen to localstorage changes to update selectedPage
window.addEventListener('storage', (event) => {
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
  }
})

selectedElement.subscribe((value) => {
  if (value && value.type !== 'page') {
    saveStorage('selectedElement', value)
  }
})
</script>

<PageBuilder selectedPage={$selectedPage} />
