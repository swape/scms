import type { ContentType } from '../../../../types/types'

export const blockLinkDefault = (extra: Partial<ContentType> = {}): ContentType =>
  ({
    type: 'block-link',
    label: 'Link',
    content: 'Link text',
    settings: {
      href: '',
      target: '_self',
    },
    styles: {
      marginTop: '',
      marginBottom: '',
      blockWidth: '',
      inlinePadding: 'block-inline-spacing-md',
      textAlign: '',
    },
    colors: {
      textColorKey: 'text_1',
    },
    parent: null,
    ...extra,
  }) as ContentType
