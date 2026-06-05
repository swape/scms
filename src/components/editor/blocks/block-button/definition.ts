import type { ContentType } from '../../../../types/types'

export const blockButtonDefault = (extra: Partial<ContentType> = {}): ContentType =>
  ({
    type: 'block-button',
    label: 'Button',
    content: 'Click me',
    settings: {
      href: '',
      target: '_self',
      padding: 'btn-padding-default',
      borderRadius: '',
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
      backgroundColorKey: 'bg_1',
    },
    parent: null,
    ...extra,
  }) as ContentType
