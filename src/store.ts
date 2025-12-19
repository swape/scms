import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { getStorage, saveStorage } from './localstorage'
import type { ProjectType } from './types/types'

export const userObj = writable(null)
export const currentProject: Writable<ProjectType | null> = writable(null)
export const projects: Writable<ProjectType[] | null> = writable([
  { id: '1', title: 'test', pages: {}, content: {} },
])
export const selectedElement = writable(null)

export const selectedPage = writable<string | null>(null)

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

window.addEventListener('storage', (event) => {
  if (event.key === 'selectedElement') {
    const selectedFromStorage = getStorage('selectedElement')
    if (selectedFromStorage && selectedFromStorage.type !== 'page') {
      selectedElement.set(selectedFromStorage)
    }
  }
})
