import type { LinkSettings } from '../../types/types.ts'

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
