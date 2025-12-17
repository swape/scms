import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import type { ProjectType } from './types/types'

export const userObj = writable(null)
export const currentProject: Writable<ProjectType | null> = writable(null)
export const projects: Writable<ProjectType[] | null> = writable([
  { id: '1', title: 'test', pages: {}, content: {} },
])
export const selectedElement = writable(null)
