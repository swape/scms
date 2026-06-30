import type { EditorPageType } from './structure.ts'
import { onPagesChange, onSelectedPageChange, pages, selectedPage, setSelectedPage } from './structure.ts'

const MAX_SUBLEVEL_DEPTH = 10

export class PageList extends HTMLElement {
  private unsubscribeFromPages?: () => void
  private unsubscribeFromSelectedPage?: () => void
  private currentPages: EditorPageType[] = []

  private getParentId(page: EditorPageType): string | null {
    return page.parentId ?? null
  }

  private getChildren(parentId: string | null): EditorPageType[] {
    return pages.filter((page) => this.getParentId(page) === parentId).sort((a, b) => a.order - b.order)
  }

  private getPageDepth(pageId: string): number {
    const pageById = new Map(pages.map((page) => [page.id, page]))
    const visited = new Set<string>()
    let currentPageId: string | null = pageId
    let depth = 0

    while (currentPageId) {
      if (visited.has(currentPageId)) {
        return Number.POSITIVE_INFINITY
      }

      visited.add(currentPageId)

      const currentPage = pageById.get(currentPageId)
      if (!currentPage) {
        return depth
      }

      currentPageId = this.getParentId(currentPage)
      if (currentPageId) {
        depth += 1
      }
    }

    return depth
  }

  private canAddChild(parentId: string | null): boolean {
    if (!parentId) {
      return true
    }

    return this.getPageDepth(parentId) < MAX_SUBLEVEL_DEPTH
  }

  private getSubLevelOrderBase(parentPage: EditorPageType, order: string | number): number {
    const parentOrder = Number(order)
    if (Number.isFinite(parentOrder)) {
      return parentOrder + 100
    }

    if (Number.isFinite(parentPage.order) && parentPage.order > 0) {
      return parentPage.order + 100
    }

    return 100
  }

  private rewriteOrderByHierarchy() {
    const rootPages = this.getChildren(null)

    rootPages.forEach((rootPage, rootIndex) => {
      rootPage.order = rootIndex
      this.rewriteChildrenOrder(rootPage)
    })
  }

  private rewriteChildrenOrder(parentPage: EditorPageType) {
    const children = this.getChildren(parentPage.id)

    if (children.length === 0) {
      return
    }

    const baseOrder = this.getSubLevelOrderBase(parentPage, parentPage.order)

    children.forEach((childPage, childIndex) => {
      childPage.order = baseOrder + childIndex + 1
      this.rewriteChildrenOrder(childPage)
    })
  }

  private buildChildrenByParent(nextPages: EditorPageType[]): Map<string | null, EditorPageType[]> {
    const childrenByParent = new Map<string | null, EditorPageType[]>()

    for (const page of nextPages) {
      const parentId = this.getParentId(page)
      const existingChildren = childrenByParent.get(parentId) ?? []
      existingChildren.push(page)
      childrenByParent.set(parentId, existingChildren)
    }

    for (const children of childrenByParent.values()) {
      children.sort((a, b) => a.order - b.order)
    }

    return childrenByParent
  }

  private renderPageBranch(page: EditorPageType, childrenByParent: Map<string | null, EditorPageType[]>, visited: Set<string>): string {
    if (visited.has(page.id)) {
      return ''
    }

    visited.add(page.id)

    const childPages = childrenByParent.get(page.id) ?? []
    const nestedItems = childPages.map((childPage) => this.renderPageBranch(childPage, childrenByParent, visited)).join('')
    const nestedList = nestedItems ? `<ul class="page-list-items page-list-items-nested">${nestedItems}</ul>` : ''
    const isSelected = selectedPage?.id === page.id
    const canAddSublevel = this.canAddChild(page.id)
    const addButton = canAddSublevel
      ? `<button type="button" class="btn page-list-item-add page-list-add" data-action="add-page" data-parent-id="${page.id}">Add page</button>`
      : ''

    return `<li class="page-list-item"><div class="page-item-group"><span class="page-list-title${isSelected ? ' page-list-title-selected' : ''}" data-id="${page.id}" data-parent-id="${page.parentId}" aria-current="${isSelected ? 'page' : 'false'}">${page.title}</span>${addButton}</div>${nestedList}</li>`
  }
  private readonly onClick = (event: Event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const addButton = target.closest<HTMLButtonElement>('[data-action="add-page"]')
    if (addButton) {
      const parentId = addButton.dataset.parentId ?? null
      if (!this.canAddChild(parentId)) {
        return
      }

      this.addPage('', parentId)
      return
    }

    const titleElement = target.closest<HTMLElement>('.page-list-title[data-id]')
    if (!titleElement) {
      return
    }

    const pageId = titleElement.dataset.id
    if (!pageId) {
      return
    }

    const nextSelectedPage = pages.find((page) => page.id === pageId) ?? null
    setSelectedPage(nextSelectedPage)
  }

  connectedCallback() {
    this.addEventListener('click', this.onClick)
    this.unsubscribeFromPages = onPagesChange((nextPages) => {
      this.currentPages = nextPages
      this.render(this.currentPages)
    })
    this.unsubscribeFromSelectedPage = onSelectedPageChange(() => {
      this.render(this.currentPages)
    })
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick)
    this.unsubscribeFromPages?.()
    this.unsubscribeFromSelectedPage?.()
    this.unsubscribeFromPages = undefined
    this.unsubscribeFromSelectedPage = undefined
  }

  private addPage(basePath = '', parentId: string | null = null) {
    if (!this.canAddChild(parentId)) {
      return
    }

    const existingPaths = new Set(pages.map((page) => page.path))
    const nextPageId = crypto.randomUUID()
    let nextPath = basePath
    let suffix = 2

    while (existingPaths.has(nextPath)) {
      nextPath = `${basePath}${suffix}`
      suffix += 1
    }

    const nextPage: EditorPageType = {
      id: nextPageId,
      title: 'new page',
      path: nextPath,
      components: [],
      parentId,
      order: 0,
    }

    pages.push(nextPage)

    this.rewriteOrderByHierarchy()
    setSelectedPage(nextPage)
  }

  private render(nextPages: EditorPageType[]) {
    const pageIds = new Set(nextPages.map((page) => page.id))
    const childrenByParent = this.buildChildrenByParent(nextPages)
    const rootPages = nextPages
      .filter((page) => {
        const parentId = this.getParentId(page)
        return !parentId || !pageIds.has(parentId)
      })
      .sort((a, b) => a.order - b.order)
    const visited = new Set<string>()
    const pageItems = rootPages.map((page) => this.renderPageBranch(page, childrenByParent, visited)).join('')

    this.innerHTML = `<div class="page-list"><div class="page-item-group"><h3 class="page-list-heading">Pages </h3><button type="button" class="btn page-list-add" data-action="add-page">Add page</button></div><ul class="page-list-items">${pageItems || '<li class="page-list-empty">No pages yet</li>'}</ul></div>`
  }
}
