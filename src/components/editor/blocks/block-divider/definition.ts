import type { ContentType } from '../../../../types/types'

export const blockDividerDefault = (extra: Partial<ContentType> = {}): ContentType =>
  ({
    type: 'block-divider',
    label: 'Divider',
    styles: {
      marginTop: 'block-spacing-top-md',
      marginBottom: 'block-spacing-bottom-md',
      blockWidth: 'block-width-md',
    },
    colors: {
      backgroundColorKey: 'bg_3',
    },
    parent: null,
    ...extra,
  }) as ContentType
