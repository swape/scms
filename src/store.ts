import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { getStorage, saveStorage } from './localstorage'
import type { ContentType, PageType, ProjectType, UserType } from './types/types'
import { getEmptyProjectStructure } from './utils/projects'

export const userObj = writable<UserType | null>(null)
export const currentProject: Writable<ProjectType | null> = writable(null)
export const projects: Writable<ProjectType[] | null> = writable([
  { ...getEmptyProjectStructure(1) }, // remove this when done testing
])
export const selectedElement = writable<PageType | ContentType | null>(null)
export const selectedPage = writable<PageType | null>(null)
export const isDarkMode = writable<boolean>(typeof localStorage === 'undefined' ? false : (getStorage('darkMode', Infinity) ?? false))

isDarkMode.subscribe((value) => {
  saveStorage('darkMode', value)
})

selectedElement.subscribe((value) => {
  if (value) {
    saveStorage('selectedElement', value)
  }
})

selectedPage.subscribe((value) => {
  if (value) {
    saveStorage('selectedPage', value)
  }
})

currentProject.subscribe((project) => {
  if (project) {
    saveStorage('currentProject', project)
  }
})

// Listen for changes to storage and update the selectedElement store accordingly
// This is coming from preview page
globalThis.addEventListener('storage', (event) => {
  if (event.key === 'selectedElement') {
    const selectedFromStorage = getStorage('selectedElement')
    selectedElement.set(selectedFromStorage)
  }
})
