import type { BlockCssRule, ContentType } from '../../types/types.ts'
import { getColorValue, getCssLength } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  const style = item.style || {}
  return [
    { selector, declarations: [getCssLength(style.borderRadius) || style.backgroundColor ? 'overflow: hidden;' : ''] },
    { selector: `${selector} .split-text`, declarations: [getCssLength(style.splitTextPadding) ? `padding: ${getCssLength(style.splitTextPadding)};` : ''] },
    {
      selector: `${selector} .link-button`,
      declarations: [
        getColorValue(style.textColor) ? `background-color: ${getColorValue(style.textColor)};` : '',
        getColorValue(style.backgroundColor) ? `color: ${getColorValue(style.backgroundColor)};` : '',
      ],
    },
  ]
}
