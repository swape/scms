import type { ContentType, LinkSettings, PageType, ProjectType } from '../types/types.ts'
import { wrapWithStyle } from './common.ts'

function getDefaultLinkSettings(content: ContentType): LinkSettings {
  return {
    text: content?.content || content?.title || 'Link',
    mode: 'url',
    url: '',
    pageId: '',
    target: '_self',
    asButton: false,
  }
}

function resolvePageTitle(project: ProjectType | null, pageId: string): string {
  if (!project || !pageId) {
    return ''
  }

  const page = project.pages.find((entry: PageType) => entry.id === pageId)

  return page?.title || ''
}

function resolveHref(link: LinkSettings): string {
  if (link.mode === 'page') {
    // TODO: resolve to the right page URL later
    return link.pageId ? `#page-${link.pageId}` : '#'
  }

  return link.url || '#'
}

export function renderLink(content: ContentType, project: ProjectType | null): string {
  const link = content.link || getDefaultLinkSettings(content)
  const text = link.text || content.title || 'Link'
  const href = resolveHref(link)
  const pageTitle = link.mode === 'page' ? resolvePageTitle(project, link.pageId) : ''
  const target = link.target || '_self'
  const rel = target === '_blank' ? 'noopener noreferrer' : ''
  const title = pageTitle ? ` title="${pageTitle}"` : ''
  const className = link.asButton ? 'link-button' : 'link-inline'
  const relAttribute = rel ? ` rel="${rel}"` : ''

  const output = `<div data-type="${content?.type || ''}" data-id="${content?.id || ''}"><a class="${className}" href="${href}" target="${target}"${relAttribute}${title}>${text}</a></div>`

  return wrapWithStyle(content, output)
}
