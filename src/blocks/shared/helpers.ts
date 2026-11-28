import type { Writable } from 'svelte/store'
import type { BlockEditorProps, ContentType, GlobalSettingsElement, LinkSettings, PageType } from '../../types/types.ts'

export function updateBlockField(key: string, value: unknown, update: BlockEditorProps['update'], debounce: BlockEditorProps['updatePageContentWithDebounce']) {
  update(key, value)
  debounce()
}

function createDefaultLinkSettings(firstPageId: string, text: string, asButton: boolean): LinkSettings {
  return {
    text,
    mode: 'url',
    url: '',
    pageId: firstPageId,
    target: '_self',
    asButton,
  }
}

export function getDefaultLinkSettings(firstPageId: string): LinkSettings {
  return createDefaultLinkSettings(firstPageId, 'Learn more', false)
}

export function getDefaultLinkEditorSettings(firstPageId: string): LinkSettings {
  return createDefaultLinkSettings(firstPageId, '', false)
}

export function getDefaultSplitBlockLinkSettings(firstPageId: string): LinkSettings {
  return createDefaultLinkSettings(firstPageId, 'Learn more', true)
}

export function updateSelectedLink(
  selectedElement: Writable<PageType | ContentType | GlobalSettingsElement | null>,
  elementType: string,
  getDefaultLinkSettings: () => LinkSettings,
  updateFn: (element: ContentType, link: LinkSettings) => void,
  debounce: BlockEditorProps['updatePageContentWithDebounce']
) {
  selectedElement.update((element) => {
    if (!element || element.type !== elementType) {
      return element
    }

    const block = element as ContentType
    const link = { ...(block.link || getDefaultLinkSettings()) }
    if (link.style) {
      link.style = { ...link.style }
    }

    updateFn(block, link)
    return { ...block, link }
  })
  debounce()
}

export function sanitizeHref(url: string): string {
  if (!url) {
    return '#'
  }
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return url
  }
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return url
    }
    return '#'
  } catch {
    return '#'
  }
}

export interface LinkAttrs {
  href: string
  target: '_blank' | '_self'
  rel: string | undefined
}

export function getLinkAttrs(link: LinkSettings | undefined): LinkAttrs {
  const href = link?.mode === 'page' ? `#page-${link.pageId || ''}` : link?.url || '#'
  const target = link?.target === '_blank' ? '_blank' : '_self'
  return { href: sanitizeHref(href), target, rel: target === '_blank' ? 'noopener noreferrer' : undefined }
}
