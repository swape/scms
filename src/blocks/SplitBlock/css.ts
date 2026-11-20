import type { BlockCssRule, ContentType, StyleMode } from '../../types/types.ts'
import { getColorValue, getCssLength } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string, mode: StyleMode = 'normal'): BlockCssRule[] {
  const style = item.style || {}
  const clipped = getCssLength(style.borderRadius) || style.backgroundColor
  const rules: BlockCssRule[] = [
    { selector, declarations: [clipped ? 'overflow: hidden;' : mode === 'mobile' ? 'overflow: visible;' : ''] },
    { selector: `${selector} .split-text`, declarations: [getCssLength(style.splitTextPadding) ? `padding: ${getCssLength(style.splitTextPadding)};` : ''] },
    { selector: `${selector} .split-image`, declarations: [getCssLength(style.splitImageMinHeight) ? `min-height: ${getCssLength(style.splitImageMinHeight)};` : ''] },
    {
      selector: `${selector} .link-button`,
      declarations: [
        getColorValue(style.textColor) ? `background-color: ${getColorValue(style.textColor)};` : mode === 'mobile' ? 'background-color: transparent;' : '',
        getColorValue(style.backgroundColor) ? `color: ${getColorValue(style.backgroundColor)};` : mode === 'mobile' ? 'color: inherit;' : '',
      ],
    },
  ]
  if (mode === 'mobile' && typeof item.mobileStyle?.flipped === 'boolean') {
    rules.push(
      { selector, declarations: [`gap: ${item.flipped ? '32px' : '0'};`] },
      { selector: `${selector} .split-text`, declarations: [`order: ${item.flipped ? '2' : '0'};`] },
      { selector: `${selector} .split-image`, declarations: ['order: 0;'] }
    )
  }
  return rules
}
