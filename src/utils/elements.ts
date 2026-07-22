import { get } from 'svelte/store'
import { currentProject, selectedElement, selectedPage } from '../store'
import type { ContentType, LinkSettings } from '../types/types'

export function getDefaultLinkSettings(firstPageId: string): LinkSettings {
  return {
    text: 'Learn more',
    mode: 'url',
    url: '',
    pageId: firstPageId,
    target: '_self',
    asButton: false,
  }
}

export function buildNewElement(type: string, name: string, pageId: string, order: number): ContentType {
  const newElement: ContentType = {
    id: String(Date.now()),
    order,
    parent: null,
    pageId,
    title: name,
    type,
    content: String(type === 'text' || type === 'header' ? 'New text content' : ''),
    style: {
      wrapper: 'container',
      marginBottom: '24',
    },
  }

  if (type === 'link') {
    const firstPageId = get(currentProject)?.pages?.[0]?.id || ''
    newElement.link = getDefaultLinkSettings(firstPageId)
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
