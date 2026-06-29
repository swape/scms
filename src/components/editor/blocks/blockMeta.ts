import type { ContentType } from '../../../types/types'
import { blockButtonDefault } from './block-button/definition'
import { blockDividerDefault } from './block-divider/definition'
import { blockLinkDefault } from './block-link/definition'
import { blockSplitDefault } from './block-split/definition'
import { blockTextDefault } from './block-text/definition'

export interface BlockMeta {
  type: string
  label: string
  defaultData: (extra?: Partial<ContentType>) => ContentType
}

export const blockMeta: BlockMeta[] = [
  { type: blockTextDefault().type, label: blockTextDefault().label ?? '', defaultData: blockTextDefault },
  { type: blockDividerDefault().type, label: blockDividerDefault().label ?? '', defaultData: blockDividerDefault },
  { type: blockButtonDefault().type, label: blockButtonDefault().label ?? '', defaultData: blockButtonDefault },
  { type: blockLinkDefault().type, label: blockLinkDefault().label ?? '', defaultData: blockLinkDefault },
  { type: blockSplitDefault().type, label: blockSplitDefault().label ?? '', defaultData: blockSplitDefault },
]
