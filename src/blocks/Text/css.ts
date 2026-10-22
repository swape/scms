import type { BlockCssRule, ContentType } from '../../types/types.ts'
import { getTextAlign } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  return [
    { selector: `${selector} h2`, declarations: [getTextAlign(item.style?.titleAlign)] },
    { selector: `${selector} p`, declarations: [getTextAlign(item.style?.textAlign)] },
  ]
}
