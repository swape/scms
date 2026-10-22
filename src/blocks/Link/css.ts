import type { BlockCssRule, ContentType } from '../../types/types.ts'
import { getColorValue } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  if (!item.link?.asButton) {
    return []
  }

  return [
    {
      selector: `${selector} .link-button`,
      declarations: [
        getColorValue(item.link.style?.buttonColor) ? `background-color: ${getColorValue(item.link.style?.buttonColor)};` : '',
        getColorValue(item.link.style?.buttonTextColor) ? `color: ${getColorValue(item.link.style?.buttonTextColor)};` : '',
      ],
    },
  ]
}
