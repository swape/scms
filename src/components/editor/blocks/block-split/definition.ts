import type { ContentType } from '../../../../types/types'

export const blockSplitDefault = (extra: Partial<ContentType> = {}): ContentType =>
  ({
    type: 'block-split',
    label: 'Split',
    content: '',
    settings: {
      columns: 2,
      gap: 'split-gap-md',
      align: 'split-align-start',
    },
    styles: {
      marginTop: '',
      marginBottom: '',
      blockWidth: '',
      inlinePadding: '',
      blockPadding: '',
    },
    colors: {
      backgroundColorKey: '',
    },
    parent: null,
    ...extra,
  }) as ContentType
