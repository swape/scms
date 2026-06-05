import type { ContentType } from '../../../../types/types'

export const blockTextDefault = (extra: Partial<ContentType> = {}): ContentType =>
  ({
    type: 'block-text',
    label: 'Text block',
    content: 'New Block',
    settings: {
      type: 'Paragraph',
    },
    options: {
      elementTypes: ['Paragraph', 'Heading 1', 'Heading 2', 'Heading 3'],
    },
    styles: {
      marginTop: '',
      marginBottom: '',
      blockWidth: '',
      inlinePadding: 'block-inline-spacing-md',
      blockPadding: '',
      borderRadius: '',
      borderWidth: '',
      cornerShape: '',
      textAlign: '',
    },
    colors: {
      textColorKey: '',
      backgroundColorKey: '',
      borderColorKey: '',
    },
    parent: null,
    ...extra,
  }) as ContentType
