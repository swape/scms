import { get } from 'svelte/store'
import { getElementDefinition } from '../components/editor/elements-list.ts'
import { currentProject, selectedElement, selectedPage } from '../store'
import type { ContentType } from '../types/types'

export { getDefaultLinkSettings } from '../blocks/shared/defaults.ts'

export function buildNewElement(type: string, name: string, pageId: string, order: number): ContentType {
  const definition = getElementDefinition(type)
  if (!definition) {
    throw new Error(`Cannot create unregistered block type: ${type}`)
  }
  const defaults = definition.defaults?.(get(currentProject)?.pages?.[0]?.id || '')
  const newElement: ContentType = {
    ...defaults,
    id: String(Date.now()),
    order,
    parent: null,
    pageId,
    title: name,
    type,
    content: defaults?.content ?? '',
    style: {
      wrapper: 'container',
      marginBottom: '24',
      ...defaults?.style,
    },
  }

  return newElement
}

export function addElement(type: string, name: string): void {
  const page = get(selectedPage)
  if (!page) {
    return
  }

  const project = get(currentProject)
  if (!project) {
    return
  }

  const existingCount = page.content?.length ?? 0
  const newElement = buildNewElement(type, name, page.id, existingCount + 1)

  const updatedPage = { ...page, content: [...(page.content ?? []), newElement] }
  selectedPage.set(updatedPage)

  project.pages = project.pages.map((p) => {
    if (p.id === updatedPage.id) {
      return { ...updatedPage }
    }
    return p
  })
  currentProject.set(project)
  selectedElement.set(newElement)
}
