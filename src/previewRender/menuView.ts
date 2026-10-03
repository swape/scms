import { getStorage } from '../localstorage.ts'
import type { MenuElement, PageType, ProjectType } from '../types/types.ts'
import { escapeHtml, sanitizeHref } from './common.ts'

function renderPageLink(page: PageType): string {
  const title = escapeHtml(page.title)
  const pageId = escapeHtml(page.id)
  return `<li><a href="#page-${pageId}" data-page-id="${pageId}">${title}</a></li>`
}

function renderItems(items: MenuElement[], project: ProjectType): string {
  return items
    .map((item) => {
      const title = escapeHtml(item.title)
      if (item.type === 'auto') {
        const pages = project.pages.filter((page) => page.parentId === item.autoParentPageId).sort((first, second) => (first.order || 0) - (second.order || 0))
        const visiblePages = item.autoMaxItems && item.autoMaxItems > 0 ? pages.slice(0, item.autoMaxItems) : pages
        return `<li class="menu-auto"><span>${title}</span><ul>${visiblePages.map(renderPageLink).join('')}</ul></li>`
      }

      if (item.type === 'dropdown') {
        return `<li class="menu-dropdown"><details><summary>${title}</summary><ul>${renderItems(item.children ?? [], project)}</ul></details></li>`
      }

      const link = item.link
      const pageId = link?.mode === 'page' ? link.pageId : ''
      const rawHref = pageId ? `#page-${pageId}` : link?.mode === 'url' ? link.url : '#'
      const href = escapeHtml(sanitizeHref(rawHref))
      const target = link?.target === '_blank' ? '_blank' : '_self'
      const rel = target === '_blank' ? ' rel="noopener noreferrer"' : ''
      const pageAttribute = pageId ? ` data-page-id="${escapeHtml(pageId)}"` : ''
      return `<li><a href="${href}" target="${target}"${rel}${pageAttribute}>${title}</a></li>`
    })
    .join('')
}

function safeColor(value: string | undefined): string {
  return value && /^#[\da-f]{6}$/i.test(value) ? value : ''
}

export function renderMenu(): void {
  const menuElement = document.getElementById('menu')
  if (!menuElement) {
    return
  }

  const project = getStorage('currentProject') as ProjectType | null
  if (!project?.menu) {
    menuElement.innerHTML = ''
    return
  }

  const menuStyle = project.menu.style ?? {}
  const layout = menuStyle.layout === 'vertical' ? 'vertical' : 'horizontal'
  const backgroundColor = safeColor(menuStyle.backgroundColor)
  const textColor = safeColor(menuStyle.textColor)
  const colors = [backgroundColor ? `background-color: ${backgroundColor};` : '', textColor ? `color: ${textColor};` : ''].join('')
  const items = renderItems(project.menu.elements ?? [], project)
  menuElement.innerHTML = `<nav class="container menu-inner" aria-label="Main navigation" style="${colors}"><ul class="menu-list menu-${layout}">${items}</ul></nav>`
}
