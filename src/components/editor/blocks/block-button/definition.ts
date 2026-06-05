import type { ContentType } from '../../../../types/types'

export const blockButtonDefault = (extra: Partial<ContentType> = {}): ContentType =>
  ({
    type: 'block-button',
    label: 'Button',
    content: 'Click me',
    settings: {
      href: '',
      target: '_self',
    },
    styles: {
      marginTop: '',
      marginBottom: '',
      blockWidth: '',
      textAlign: '',
      padding: 'btn-padding-default',
      borderRadius: '',
      borderWidth: '',
    },
    colors: {
      textColorKey: 'text_1',
      backgroundColorKey: 'bg_2',
      borderColorKey: '',
    },
    parent: null,
    ...extra,
  }) as ContentType
