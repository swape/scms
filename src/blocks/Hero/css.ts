import type { BlockCssRule, ContentType } from '../../types/types.ts'
import { getButtonColorDeclarations, getCssLength, getTextAlign } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  const style = item.style ?? {}
  const overlay = Number(style.heroOverlay ?? 40)
  return [
    { selector, declarations: [`min-height: ${getCssLength(style.heroMinHeight) || '420px'};`, getTextAlign(style.textAlign)] },
    { selector: `${selector} .hero-content`, declarations: [`max-width: ${getCssLength(style.heroContentWidth) || '720px'};`] },
    { selector: `${selector} .hero-content :is(h1, h2, h3, h4, h5, h6)`, declarations: [`font-size: ${getCssLength(style.heroHeadingSize) || '3rem'};`] },
    { selector: `${selector} .hero-overlay`, declarations: [`opacity: ${Number.isFinite(overlay) ? Math.min(100, Math.max(0, overlay)) / 100 : 0.4};`] },
    { selector: `${selector} .hero-button`, declarations: getButtonColorDeclarations(style.heroButtonColor, style.heroButtonTextColor) },
  ]
}
