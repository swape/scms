import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { getStorage, saveStorage } from './localstorage'
import type { ProjectType } from './types/types'

export const userObj = writable(null)
export const currentProject: Writable<ProjectType | null> = writable(null)
export const projects: Writable<ProjectType[] | null> = writable([
  {
    id: '1',
    title: 'test',
    pages: {},
    content: {},
    colors: {
      bg_1: { c: '#ffffff', key: 'bg_1' },
      text_1: { c: '#000000', key: 'text_1' },
      bg_2: { c: '#f0f0f0', key: 'bg_2' },
      text_2: { c: '#333333', key: 'text_2' },
      bg_3: { c: '#ff0000', key: 'bg_3' },
      bg_3_text: { c: '#ffffff', key: 'bg_3_text' },
      bg_1_dark: { c: '#000000', key: 'bg_1_dark' },
      text_1_dark: { c: '#ffffff', key: 'text_1_dark' },
      bg_2_dark: { c: '#333333', key: 'bg_2_dark' },
      text_2_dark: { c: '#f0f0f0', key: 'text_2_dark' },
      bg_3_dark: { c: '#cc0000', key: 'bg_3_dark' },
      bg_3_text_dark: { c: '#000000', key: 'bg_3_text_dark' },
    },
    users: {},
  },
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
