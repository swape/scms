import type { BlockCssRule, ContentType } from '../../types/types.ts'
import { getColorValue, getCssLength, getTextAlign } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  const style = item.style ?? {}
  return [
    { selector, declarations: [getTextAlign(style.textAlign)] },
    { selector: `${selector} .cta-content`, declarations: [`max-width: ${getCssLength(style.ctaContentWidth) || '720px'};`] },
    { selector: `${selector} .cta-content h2`, declarations: [`font-size: ${getCssLength(style.ctaHeadingSize) || '2rem'};`] },
    {
      selector: `${selector} .cta-button`,
      declarations: [`background-color: ${getColorValue(style.ctaButtonColor) || 'var(--text_1)'};`, `color: ${getColorValue(style.ctaButtonTextColor) || 'var(--bg_1)'};`],
    },
  ]
}
