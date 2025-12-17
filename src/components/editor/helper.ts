import type { ContentListType, PageType } from '../../types/types'

export function getPagesAsArray(
  pagesObj: PageType,
  parentId: null | string = null
) {
  const pages = Object.values(pagesObj || {})
  return pages
    .filter((p) => p?.parent === parentId)
    .toSorted((a, b) => a.order - b.order)
}

export function getBlocksAsArray(
  content: ContentListType,
  pageId: string,
  parentId: null | string = null
) {
  const contents = Object.values(content || [])
  return contents
    .filter((c) => c?.pageId === pageId && c?.parent === parentId)
    .toSorted((a, b) => a.order - b.order)
}
