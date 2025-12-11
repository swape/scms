
import type { PageType} from '../../types/types'


export function getPagesAsArray(pagesObj:PageType, parentId: null | string = null) {
  const pages = Object.values(pagesObj || {})
  return pages.filter((p) => p?.parent === parentId).toSorted((a, b) => a.order - b.order)
}