import type {
  ContentListType,
  ContentType,
  PageType,
  ProjectType,
} from '../../types/types'

export function getPagesAsArray(
  pagesObj: { [key: string]: PageType } | undefined,
  parentId: null | string = null
) {
  const pages = Object.values(pagesObj || {})
  return pages
    .filter((p) => p?.parent === parentId)
    .toSorted((a, b) => a.order - b.order)
}

export function getBlocksAsArray(
  content: ContentListType | undefined,
  pageId: string,
  parentId: null | string = null
) {
  const contents = Object.values(content || [])
  return contents
    .filter((c) => c?.pageId === pageId && c?.parent === parentId)
    .toSorted((a, b) => a.order - b.order)
}

export function isContentElement(
  elm: PageType | ContentType | null
): elm is ContentType {
  return elm !== null && elm.type !== 'page'
}

export function savePage(project: ProjectType, element: PageType): ProjectType {
  const pages: NonNullable<ProjectType['pages']> = project.pages
    ? { ...project.pages }
    : {}
  pages[element.id] = element
  return { ...project, pages }
}

export function saveContent(
  project: ProjectType,
  element: ContentType
): ProjectType {
  const content: NonNullable<ProjectType['content']> = project.content
    ? { ...project.content }
    : {}
  content[element.id] = element
  return { ...project, content }
}

export function deletePageWithContent(
  project: ProjectType,
  elm: PageType
): ProjectType {
  const pages: NonNullable<ProjectType['pages']> = project.pages
    ? { ...project.pages }
    : {}
  delete pages[elm.id]
  const content: NonNullable<ProjectType['content']> = project.content
    ? { ...project.content }
    : {}
  Object.values(content).forEach((contentElm) => {
    if (contentElm.pageId === elm.id) {
      delete content[contentElm.id]
    }
  })
  return { ...project, pages, content }
}

export function deleteContentItem(
  project: ProjectType,
  elm: ContentType
): ProjectType {
  const content: NonNullable<ProjectType['content']> = project.content
    ? { ...project.content }
    : {}
  delete content[elm.id]
  return { ...project, content }
}
