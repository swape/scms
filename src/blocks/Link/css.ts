import type { BlockCssRule, ContentType, StyleMode } from '../../types/types.ts'
import { getColorValue } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string, mode: StyleMode = 'normal'): BlockCssRule[] {
  if (mode === 'mobile') {
    const asButton = item.link?.asButton
    return [
      {
        selector: `${selector} > :is(.link-button, .link-inline)`,
        declarations: [
          `display: ${asButton ? 'inline-block' : 'inline'};`,
          `padding: ${asButton ? '10.4px 16px' : '0'};`,
          `border-radius: ${asButton ? '8px' : '0'};`,
          `text-decoration: ${asButton ? 'none' : 'underline'};`,
          `background-color: ${(asButton && getColorValue(item.link?.style?.buttonColor)) || 'transparent'};`,
          `color: ${(asButton && getColorValue(item.link?.style?.buttonTextColor)) || 'inherit'};`,
        ],
      },
    ]
  }
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
