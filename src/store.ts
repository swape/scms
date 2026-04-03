import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { getEmptyProjectStructure } from './components/projects/helper'
import { getStorage, saveStorage } from './localstorage'
import type { ContentType, PageType, ProjectType, UserType } from './types/types'

export const userObj = writable<UserType | null>(null)
export const currentProject: Writable<ProjectType | null> = writable(null)
export const projects: Writable<ProjectType[] | null> = writable([
  { ...getEmptyProjectStructure(1) }, // remove this when done testing
])
export const selectedElement = writable<PageType | ContentType | null>(null)
export const selectedPage = writable<PageType | null>(null)

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

globalThis.addEventListener('storage', (event) => {
  if (event.key === 'selectedElement') {
    const selectedFromStorage = getStorage('selectedElement')
    if (selectedFromStorage && selectedFromStorage.type !== 'page') {
      selectedElement.set(selectedFromStorage)
    }
  }
})
