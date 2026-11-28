import { MOBILE_STYLE_MAX_WIDTH } from '../../constants.ts'
import type { BlockCssRule, ContentType, StyleMode } from '../../types/types.ts'
import { getColorValue, getCssLength, getTextAlign } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string, mode: StyleMode = 'normal'): BlockCssRule[] {
  const style = item.style ?? {}
  const rawColumns = Number(mode === 'mobile' ? (item.mobileStyle?.cardGridColumns ?? 1) : (style.cardGridColumns ?? 3))
  const columns = Number.isFinite(rawColumns) ? Math.min(6, Math.max(1, Math.round(rawColumns))) : mode === 'mobile' ? 1 : 3
  const columnDeclaration = `grid-template-columns: repeat(${columns}, minmax(0, 1fr));`
  return [
    { selector, declarations: [getTextAlign(style.textAlign)] },
    {
      selector: `${selector} .card-grid-items`,
      declarations: [
        `gap: ${getCssLength(style.cardGridGap) || '24px'};`,
        mode === 'mobile' ? columnDeclaration : `@media (min-width: ${MOBILE_STYLE_MAX_WIDTH + 1}px) { ${columnDeclaration} }`,
      ],
    },
    {
      selector: `${selector} .card-grid-card`,
      declarations: [
        `border-radius: ${getCssLength(style.cardRadius) || '12px'};`,
        `background-color: ${getColorValue(style.cardBackgroundColor) || 'transparent'};`,
        `color: ${getColorValue(style.cardTextColor) || 'inherit'};`,
      ],
    },
    { selector: `${selector} .card-grid-body`, declarations: [`padding: ${getCssLength(style.cardPadding) || '24px'};`] },
    { selector: `${selector} .card-grid-image`, declarations: [`height: ${getCssLength(style.cardImageHeight) || '200px'};`] },
  ]
}
